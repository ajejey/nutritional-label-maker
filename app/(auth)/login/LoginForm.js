
import { createAdminClient } from '@/app/lib/appwrite/config';
import auth from '@/auth';
import { Button } from '@/components/ui/button';
import { ArrowBigRight, AtSign, KeyRoundIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
 
export default async function LoginForm() {
  const user = await auth.getUser()

  if(user){
    redirect('/admin')
  }

  async function createSession(formData) {
    "use server";
    const data = Object.fromEntries(formData)
    const {email, password} = data

    const {account} = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password)

    cookies().set('session', session.secret, {
      httpOnly: true,
      sameSite:'strict',
      path: '/',
      expires: new Date(session.expire),
    })
    redirect('/dashboard')
  }
 
  return (
    <form action={createSession} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 p-8">
  <h1 className="mb-3 text-2xl">Please log in to continue.</h1>
  <div className="w-full">
    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <div className="relative">
        <input
          id="email"
          type="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email address"
          required
        />
        {/* <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
      </div>
    </div>
    <div className="mb-6">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <div className="relative">
        <input
          id="password"
          type="password"
          name="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
          required
          minLength={6}
        />
        {/* <KeyRoundIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
      </div>
    </div>
  </div>
  <Button className="w-full">
    Log in
    <ArrowBigRight className="ml-2 h-5 w-5" />
  </Button>
  <div className="mt-4 h-8 flex items-center" aria-live="polite" aria-atomic="true">
    {/* Error message placeholder */}
  </div>
</div>
    </form>
  );
}