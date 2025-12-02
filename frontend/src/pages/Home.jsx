import { useEffect } from 'react';
import { usePostsStore } from '@/store/posts';
import { postsService } from '@/services/posts';
import CreatePost from '@/components/post/CreatePost';
import PostCard from '@/components/post/PostCard';
import PostSkeleton from '@/components/post/PostSkeleton';
import { toast } from 'sonner';

export default function Home() {
    const { posts, loading, setPosts, setLoading, setError } = usePostsStore();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const data = await postsService.getAllPosts();
                setPosts(data);
            } catch (error) {
                setError(error.message);
                toast.error('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [setPosts, setLoading, setError]);

    return (
        <div className="container max-w-2xl py-6 space-y-6">
            <CreatePost />

            <div className="space-y-4">
                {loading ? (
                    <>
                        {[1, 2, 3].map((i) => (
                            <PostSkeleton key={i} />
                        ))}
                    </>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No posts yet. Be the first to post!</p>
                    </div>
                ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
            </div>
        </div>
    );
}
