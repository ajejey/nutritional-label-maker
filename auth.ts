import { cookies } from "next/headers"
import { createSessionClient } from "./app/lib/appwrite/config"
import { redirect } from "next/navigation"
import { Models } from "appwrite"

export interface AuthUser extends Models.User<Models.Preferences> {
    $id: string;
    name: string;
    email: string;
}

interface AuthType {
    user: AuthUser | null;
    sessionCookie: { name: string; value: string; } | null;
    getUser: () => Promise<AuthUser | null>;
    deleteSession: () => Promise<void>;
}

const auth: AuthType = {
    user: null,
    sessionCookie: null,

    getUser: async () => {
        auth.sessionCookie = cookies().get('session') || null
        try {
            const {account} = await createSessionClient(auth.sessionCookie?.value)
            auth.user = await account.get()
        } catch (error) {
            console.error(error)
            auth.user = null
            auth.sessionCookie = null
        }

        return auth.user
    },

    deleteSession: async () => {
        "use server";
        auth.sessionCookie = cookies().get('session') || null
        try {
            const {account} = await createSessionClient(auth.sessionCookie?.value)
            await account.deleteSession('current')
        } catch (error) {
            console.error(error)
            cookies().delete('session')
            auth.user = null
            auth.sessionCookie = null
            redirect('/login')
        }
    }
}

export default auth