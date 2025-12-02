import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

export default function AddComment({ onAddComment, loading }) {
    const user = useAuthStore((state) => state.user);
    const [content, setContent] = useState('');

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        onAddComment(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 items-start">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback className="text-xs">{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
                <Input
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" disabled={loading || !content.trim()}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post
                </Button>
            </div>
        </form>
    );
}
