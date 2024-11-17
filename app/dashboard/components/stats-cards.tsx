import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
    totalPosts: number | undefined;
    publishedPosts: number | undefined;
    draftPosts: number | undefined;
}

export function StatsCards({ totalPosts, publishedPosts, draftPosts }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPosts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Published</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{publishedPosts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{draftPosts}</div>
                </CardContent>
            </Card>
        </div>
    );
}