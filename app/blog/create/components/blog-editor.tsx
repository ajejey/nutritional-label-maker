'use client';

import { createPost, updatePost } from "@/app/lib/blog";
import { BlogPost } from "@/app/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import styles from './blog-editor.module.css';

interface BlogEditorProps {
    post?: BlogPost;
}

export function BlogEditor({ post }: BlogEditorProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState(post?.content || '');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const excerpt = formData.get('excerpt') as string;
        const published = formData.get('published') === 'on';
        
        // Create slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        try {
            if (post) {
                const result = await updatePost(post.$id, {
                    title,
                    content,
                    excerpt,
                    published,
                    slug,
                });
                if (!result.success) throw new Error(result.error);
            } else {
                const result = await createPost({
                    title,
                    content,
                    excerpt,
                    published,
                    slug,
                    authorId: '', // Will be set by server
                    authorName: '', // Will be set by server
                });
                if (!result.success) throw new Error(result.error);
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={post?.title}
                    required
                    placeholder="Enter your blog post title"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={post?.excerpt}
                    required
                    placeholder="Enter a short description"
                    className="h-20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className={`border rounded-md bg-white ${styles.editor}`}>
                    <CKEditor
                        onReady={(editor) => {
                            // Insert the toolbar before the editable area.
                            editor.ui.getEditableElement()?.parentElement?.insertBefore(
                                editor.ui.view.toolbar.element!,
                                editor.ui.getEditableElement()!
                            );
                        }}
                        editor={DecoupledEditor}
                        data={content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
                        config={{
                            placeholder: 'Write your blog post content here...',
                            toolbar: {
                                items: [
                                    'undo', 'redo',
                                    '|',
                                    'heading',
                                    '|',
                                    'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                    '|',
                                    'bold', 'italic', 'underline', 'strikethrough',
                                    '|',
                                    'alignment',
                                    '|',
                                    'numberedList', 'bulletedList',
                                    'outdent', 'indent',
                                    '|',
                                    'link', 'blockQuote', 'insertTable', 'mediaEmbed',
                                    '|',
                                    'code', 'codeBlock',
                                ],
                                shouldNotGroupWhenFull: true
                            },
                            heading: {
                                options: [
                                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                                ]
                            },
                            list: {
                                properties: {
                                    styles: true,
                                    startIndex: true,
                                    reversed: true
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="published"
                    name="published"
                    defaultChecked={post?.published}
                />
                <Label htmlFor="published">Publish post</Label>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
                </Button>
            </div>
        </form>
    );
}