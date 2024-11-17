import { BlogEditor } from "./components/blog-editor";

export default function CreateBlogPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
                <BlogEditor />
            </div>
        </div>
    );
}