import { getPublishedPosts } from "../lib/blog";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
    const result = await getPublishedPosts();
    const posts = result.success ? result.posts : [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
                        Our Blog
                    </h1>
                    <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
                        Discover nutrition insights, healthy recipes, and expert advice on food labeling
                    </p>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts && posts.map((post) => (
                        <Link 
                            key={post.$id} 
                            href={`/blog/${post.slug}`}
                            className="group"
                        >
                            <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                                {/* Optional: Add featured image here */}
                                <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <span className="text-4xl">📝</span>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            {post.authorName[0]}
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {post.authorName}
                                            </p>
                                            {/* <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(post.$createdAt), { addSuffix: true })}
                                            </p> */}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                        {post.title}
                                    </h2>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="inline-flex items-center">
                                            Read more
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts && posts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No posts yet
                        </h3>
                        <p className="text-gray-600">
                            Check back soon for new content!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}