import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Trash2, Pencil } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { usePostsStore } from '@/store/posts';
import { postsService } from '@/services/posts';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, onDeleted, onUpdated }) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const toggleLike = usePostsStore((state) => state.toggleLike);
    const deletePostFromStore = usePostsStore((state) => state.deletePost);
    const [liking, setLiking] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);

    const isLiked = post.likes?.includes(user?._id);
    const likesCount = post.likes?.length || 0;

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (liking) return;

        setLiking(true);
        try {
            if (isLiked) {
                await postsService.unlikePost(post._id);
            } else {
                await postsService.likePost(post._id);
            }
            toggleLike(post._id, user._id);
        } catch (error) {
            toast.error('Failed to update like');
        } finally {
            setLiking(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/post/${post._id}`);
    };

    const isOwner = user?._id === post.author?._id;

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (deleting) return;
        setDeleting(true);
        try {
            await postsService.deletePost(post._id);
            deletePostFromStore(post._id);
            onDeleted && onDeleted(post._id);
            toast.success('Post deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
        } finally {
            setDeleting(false);
        }
    };

    const handleEditImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
        if (valid.length !== files.length) {
            toast.error('Each image must be less than 5MB');
        }
        setEditImage(valid);
        const reader = new FileReader();
        reader.onloadend = () => setEditPreview(reader.result);
        reader.readAsDataURL(valid[0]);
    };

    const handleSaveEdit = async (e) => {
        e.stopPropagation();
        if (savingEdit) return;
        setSavingEdit(true);
        try {
            const fd = new FormData();
            fd.append('content', editContent);
            if (Array.isArray(editImage) && editImage.length) {
                editImage.forEach((img) => fd.append('images', img));
            }
            const updated = await postsService.updatePost(post._id, fd);
            // Update local store
            // Prefer store update; but also notify parent for local state scenarios
            // Home uses store, Profile passes onUpdated
            // Update store
            // Reuse updatePost in store
            const updateInStore = usePostsStore.getState().updatePost;
            updateInStore(post._id, updated);
            onUpdated && onUpdated(post._id, updated);
            setEditing(false);
            setEditImage(null);
            setEditPreview(null);
            toast.success('Post updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update post');
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleCardClick}>
            <CardContent className="pt-6">
                <div className="flex gap-3">
                    <Link
                        to={`/profile/${post.author?.username}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author?.profilePicture} alt={post.author?.name} />
                            <AvatarFallback>{getInitials(post.author?.name)}</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className="flex-1 space-y-3">
                        <div>
                            <Link
                                to={`/profile/${post.author?.username}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline"
                            >
                                <p className="font-semibold">{post.author?.name}</p>
                                <p className="text-sm text-muted-foreground">@{post.author?.username}</p>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>

                        {editing ? (
                            <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                                <textarea
                                    className="w-full border rounded-md p-2 text-sm bg-background text-foreground"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    maxLength={500}
                                />
                                <div className="flex items-center gap-2">
                                    <input type="file" accept="image/*" multiple onChange={handleEditImageChange} />
                                    {editPreview && (
                                        <img src={editPreview} alt="Preview" className="h-24 rounded-md object-cover" />
                                    )}
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEditing(false); }}>Cancel</Button>
                                    <Button size="sm" onClick={handleSaveEdit} disabled={savingEdit}>{savingEdit ? 'Saving...' : 'Save'}</Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                        )}

                        {Array.isArray(post.images) && post.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {post.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="Post content"
                                        className="w-full rounded-lg max-h-96 object-cover cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); window.open(img, '_blank'); }}
                                    />
                                ))}
                            </div>
                        ) : (
                            post.image && (
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    className="w-full rounded-lg max-h-96 object-cover cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); window.open(post.image, '_blank'); }}
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
                                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span>{likesCount}</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.commentsCount || 0}</span>
                            </Button>

                            {isOwner && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                                </Button>
                            )}

                            {isOwner && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit</span>
                                </Button>
                            )}
                        </div>

                        
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
