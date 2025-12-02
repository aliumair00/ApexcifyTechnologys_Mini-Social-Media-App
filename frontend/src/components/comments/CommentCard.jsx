import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { formatDistanceToNow } from 'date-fns';

export default function CommentCard({ comment, onDelete }) {
    const user = useAuthStore((state) => state.user);
    const isOwner = user?._id === comment.author?._id;

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    return (
        <div className="flex gap-3 py-3">
            <Link to={`/profile/${comment.author?.username}`}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.profilePicture} alt={comment.author?.name} />
                    <AvatarFallback className="text-xs">{getInitials(comment.author?.name)}</AvatarFallback>
                </Avatar>
            </Link>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            to={`/profile/${comment.author?.username}`}
                            className="hover:underline"
                        >
                            <span className="font-semibold text-sm">{comment.author?.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                                @{comment.author?.username}
                            </span>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    {isOwner && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => onDelete(comment._id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
            </div>
        </div>
    );
}
