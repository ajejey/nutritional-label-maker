import auth from "@/auth";
import { redirect } from "next/navigation";
import { getUserPosts } from "../lib/blog";
import { BlogList } from "./components/blog-list";
import { StatsCards } from "./components/stats-cards";
import { BlogPost } from "../types/blog";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const user = await auth.getUser();
    
    if (!user) {
        redirect('/login');
    }

    const result = await getUserPosts();

    const posts = result.success ? result.posts as unknown as BlogPost[] : [] as BlogPost[];
    
    const stats = {
        totalPosts: posts?.length,
        publishedPosts: posts?.filter(post => post.published)?.length,
        draftPosts: posts?.filter(post => !post.published)?.length,
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                
                <StatsCards {...stats} />
                
                <BlogList posts={posts} />
            </div>
        </div>
    );
}