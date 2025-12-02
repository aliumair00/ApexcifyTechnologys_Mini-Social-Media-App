import CommentCard from './CommentCard';
import { Separator } from '@/components/ui/separator';

export default function CommentList({ comments, onDeleteComment }) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {comments.map((comment, index) => (
                <div key={comment._id}>
                    <CommentCard comment={comment} onDelete={onDeleteComment} />
                    {index < comments.length - 1 && <Separator />}
                </div>
            ))}
        </div>
    );
}
