import { BlogEditor } from "../../create/components/blog-editor";
import { createSessionClient, DATABASE_ID, POSTS_COLLECTION_ID } from "@/app/lib/appwrite/config";
import auth from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditBlogPageProps {
    params: {
        id: string;
    };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    const user: any = await auth.getUser();
    if (!user) {
        redirect('/login');
    }

    try {
        const { databases } = createSessionClient(auth.sessionCookie?.value);
        const post: any = await databases.getDocument(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            params.id
        );

        // Check if user is the author
        if (post.authorId !== user.$id) {
            redirect('/dashboard');
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
                    <BlogEditor post={post} />
                </div>
            </div>
        );
    } catch (error) {
        redirect('/dashboard');
    }
}