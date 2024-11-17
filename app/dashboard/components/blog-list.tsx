'use client';

import { BlogPost } from "@/app/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePost } from "@/app/lib/blog";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogListProps {
    posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
    const router = useRouter();

    const handleDelete = async (postId: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const result = await deletePost(postId);
            if (result.success) {
                router.refresh();
            }
        }
    };

    if (posts && posts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Posts Yet</CardTitle>
                    <CardDescription>
                        Create your first blog post to get started.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href="/blog/create">
                        <Button>Create Post</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Blog Posts</h2>
                <Link href="/blog/create">
                    <Button>Create New Post</Button>
                </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {posts && posts.map((post) => (
                    <Card key={post.$id}>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>
                                {new Date(post.$createdAt).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{post.excerpt}</p>
                            <div className="mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(post.$id)}
                            >
                                Delete
                            </Button>
                            <Link href={`/blog/edit/${post.$id}`}>
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </Link>
                            <Link href={`/blog/${post.slug}`}>
                                <Button size="sm">
                                    View
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}