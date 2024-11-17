import { AuthForm } from "@/app/components/auth/auth-form"
import { checkAuthStatus } from "@/app/lib/appwrite/auth-actions"
import { redirect } from "next/navigation"

// Add this export to make the page dynamic
export const dynamic = 'force-dynamic'

export default async function SignupPage() {
    // Check if user is already logged in
    const isAuthenticated = await checkAuthStatus()
    if (isAuthenticated) {
        redirect('/dashboard')
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Create an Account
                </h1>
                <AuthForm />
            </div>
        </div>
    )
}