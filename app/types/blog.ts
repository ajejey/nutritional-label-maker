export interface BlogPost {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    title: string;
    content: string;
    excerpt: string;
    authorId: string;
    authorName: string;
    published: boolean;
    slug: string;
}

export type CreateBlogPost = Omit<BlogPost, '$id' | '$createdAt' | '$updatedAt'>;
export type UpdateBlogPost = Partial<CreateBlogPost>;