'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'node-appwrite';
import { checkAuthStatus, getCurrentUser, logout } from '../lib/appwrite/auth-actions';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    logout: async () => {},
    refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(!!currentUser);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const isAuthed = await checkAuthStatus();
                if (isAuthed) {
                    await refreshUser();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                logout: handleLogout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};