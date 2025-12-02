import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useUsersStore } from '@/store/users';
import { followService } from '@/services/follow';
import { toast } from 'sonner';
import { UserPlus, UserMinus } from 'lucide-react';

export default function UserCard({ user: searchUser }) {
    const currentUser = useAuthStore((state) => state.user);
    const { following, toggleFollow } = useUsersStore();
    const [loading, setLoading] = useState(false);

    const isFollowing = following.includes(searchUser._id);
    const isOwnProfile = currentUser?._id === searchUser._id;

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    const handleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await followService.unfollowUser(searchUser._id);
                toast.success(`Unfollowed ${searchUser.name}`);
            } else {
                await followService.followUser(searchUser._id);
                toast.success(`Following ${searchUser.name}`);
            }
            toggleFollow(searchUser._id);
        } catch (error) {
            toast.error('Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <Link
                        to={`/profile/${searchUser.username}`}
                        className="flex items-center gap-3 flex-1"
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={searchUser.profilePicture} alt={searchUser.name} />
                            <AvatarFallback>{getInitials(searchUser.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{searchUser.name}</p>
                            <p className="text-sm text-muted-foreground">@{searchUser.username}</p>
                            {searchUser.bio && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {searchUser.bio}
                                </p>
                            )}
                        </div>
                    </Link>

                    {!isOwnProfile && (
                        <Button
                            onClick={handleFollow}
                            disabled={loading}
                            variant={isFollowing ? 'outline' : 'default'}
                            size="sm"
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Unfollow
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Follow
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
