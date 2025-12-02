import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { postsService } from '@/services/posts';
import { commentsService } from '@/services/comments';
import CommentList from '@/components/comments/CommentList';
import AddComment from '@/components/comments/AddComment';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetails() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [liking, setLiking] = useState(false);
    

    const isLiked = post?.likes?.includes(user?._id);
    const likesCount = post?.likes?.length || 0;
    const isOwner = user?._id === post?.author?._id;

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const [postData, commentsData] = await Promise.all([
                    postsService.getPostById(postId),
                    commentsService.getComments(postId),
                ]);
                setPost(postData);
                setComments(commentsData);
            } catch (error) {
                toast.error('Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [postId]);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        try {
            if (isLiked) {
                await postsService.unlikePost(postId);
                setPost({
                    ...post,
                    likes: post.likes.filter((id) => id !== user._id),
                });
            } else {
                await postsService.likePost(postId);
                setPost({
                    ...post,
                    likes: [...post.likes, user._id],
                });
            }
        } catch (error) {
            toast.error('Failed to update like');
        } finally {
            setLiking(false);
        }
    };

    const handleAddComment = async (content) => {
        setCommentLoading(true);
        try {
            const newComment = await commentsService.addComment(postId, { content });
            setComments([...comments, newComment]);
            toast.success('Comment added!');
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeletePost = async () => {
        try {
            await postsService.deletePost(postId);
            toast.success('Post deleted');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    };


    const handleDeleteComment = async (commentId) => {
        try {
            await commentsService.deleteComment(postId, commentId);
            setComments(comments.filter((c) => c._id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    if (loading) {
        return (
            <div className="container max-w-2xl py-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container max-w-2xl py-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Post not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-6 space-y-6">
            <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Feed
                </Link>
            </Button>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    {/* Post Content */}
                    <div className="flex gap-3">
                        <Link to={`/profile/${post.author?.username}`}>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={post.author?.profilePicture} alt={post.author?.name} />
                                <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="flex-1">
                            <Link to={`/profile/${post.author?.username}`} className="hover:underline">
                                <p className="font-semibold">{post.author?.name}</p>
                                <p className="text-sm text-muted-foreground">@{post.author?.username}</p>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    <p className="text-base whitespace-pre-wrap">{post.content}</p>

                    {Array.isArray(post.images) && post.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {post.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt="Post content"
                                    className="w-full rounded-lg max-h-[500px] object-cover cursor-pointer"
                                    onClick={() => window.open(img, '_blank')}
                                />
                            ))}
                        </div>
                    ) : (
                        post.image && (
                            <img
                                src={post.image}
                                alt="Post content"
                                className="w-full rounded-lg max-h-[500px] object-cover cursor-pointer"
                                onClick={() => window.open(post.image, '_blank')}
                            />
                        )
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
                            onClick={handleLike}
                            disabled={liking}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{likesCount}</span>
                        </Button>

                        {isOwner && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                onClick={handleDeletePost}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </Button>
                        )}
                    </div>

                    <Separator />

                    {/* Comments Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Comments</h3>
                        <AddComment onAddComment={handleAddComment} loading={commentLoading} />
                        <CommentList comments={comments} onDeleteComment={handleDeleteComment} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
