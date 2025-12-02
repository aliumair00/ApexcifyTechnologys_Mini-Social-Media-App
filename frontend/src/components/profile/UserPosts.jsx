import PostCard from '../post/PostCard';
import PostSkeleton from '../post/PostSkeleton';

export default function UserPosts({ posts, loading, onPostDeleted, onPostUpdated }) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <PostSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No posts yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onDeleted={onPostDeleted}
                    onUpdated={onPostUpdated}
                />
            ))}
        </div>
    );
}
