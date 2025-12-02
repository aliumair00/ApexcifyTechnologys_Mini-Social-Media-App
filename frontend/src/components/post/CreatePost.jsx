import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { usePostsStore } from '@/store/posts';
import { postsService } from '@/services/posts';
import { toast } from 'sonner';
import { Image, Loader2, X } from 'lucide-react';

export default function CreatePost() {
    const user = useAuthStore((state) => state.user);
    const addPost = usePostsStore((state) => state.addPost);
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
        if (valid.length !== files.length) {
            toast.error('Each image must be less than 5MB');
        }
        setImages((prev) => [...prev, ...valid]);
        valid.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && images.length === 0) {
            toast.error('Please add some content or an image');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            images.forEach((img) => formData.append('images', img));

            const newPost = await postsService.createPost(formData);
            addPost(newPost);
            setContent('');
            setImages([]);
            setImagePreviews([]);
            toast.success('Post created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.profilePicture} alt={user?.name} />
                            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[100px] resize-none"
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{content.length}/500</span>
                            </div>
                        </div>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {imagePreviews.map((src, idx) => (
                                <div key={idx} className="relative">
                                    <img src={src} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => removeImage(idx)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div>
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                <Image className="h-4 w-4 mr-2" />
                                Add Image
                            </Button>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
