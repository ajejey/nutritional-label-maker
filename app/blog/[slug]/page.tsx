import { createSessionClient, DATABASE_ID, POSTS_COLLECTION_ID } from "@/app/lib/appwrite/config";
import { BlogPost } from "@/app/types/blog";
import { Query } from "node-appwrite";
import { notFound } from "next/navigation";
import auth from "@/auth";
import { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

// Cache the post fetching
const getPost = unstable_cache(
    async (slug: string) => {
        const { databases } = createSessionClient();
        const posts = await databases.listDocuments(
            DATABASE_ID,
            POSTS_COLLECTION_ID,
            [Query.equal('slug', slug)]
        );

        if (posts.documents.length === 0) {
            return null;
        }

        return posts.documents[0];
    },
    ['blog-post'],
    {
        revalidate: 60, // Cache for 1 minute
        tags: ['blog-post']
    }
);

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = await getPost(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.'
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            authors: [post.authorName],
            publishedTime: post.$createdAt,
            modifiedTime: post.$updatedAt,
        }
    };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await getPost(params.slug);

    // console.log("BLOGG POSTTTTT SLUGGGGG, ", post)

    if (!post) {
        notFound();
    }

    // If post is not published, only show to author
    if (!post.published) {
        const user = await auth.getUser();
        if (!user || user.$id !== post.authorId) {
            notFound();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-16 max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {post.title}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {post.authorName[0]}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{post.authorName}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <article className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        {/* Excerpt */}
                        <div className="text-xl text-gray-600 mb-8 font-medium border-l-4 border-blue-500 pl-4">
                            {post.excerpt}
                        </div>

                        {/* Main Content */}
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
    );
}