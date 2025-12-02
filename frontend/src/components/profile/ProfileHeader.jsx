import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { usePostsStore } from '@/store/posts';
import { useUsersStore } from '@/store/users';
import { followService } from '@/services/follow';
import { usersService } from '@/services/users';
import { toast } from 'sonner';
import { UserPlus, UserMinus, Settings } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';

export default function ProfileHeader({ profile, onProfileUpdate }) {
    const user = useAuthStore((state) => state.user);
    const { following, toggleFollow } = useUsersStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(false);
    const updateUser = useAuthStore((state) => state.updateUser);

    const isOwnProfile = user?._id === profile?._id;
    const isFollowing = following.includes(profile?._id);

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    const handleFollow = async () => {
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await followService.unfollowUser(profile._id);
                toast.success(`Unfollowed ${profile.name}`);
            } else {
                await followService.followUser(profile._id);
                toast.success(`Following ${profile.name}`);
            }
            toggleFollow(profile._id);
        } catch (error) {
            toast.error('Failed to update follow status');
        } finally {
            setFollowLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Cover Photo */}
            <div className="h-48 rounded-lg overflow-hidden relative">
                {profile?.banner ? (
                    <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-blue-500/20" />
                )}
                {isOwnProfile && (
                    <div className="absolute top-2 right-2 flex gap-2">
                        <input
                            type="file"
                            id="banner-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 5 * 1024 * 1024) {
                                    toast.error('Image size should be less than 5MB');
                                    return;
                                }
                                setBannerUploading(true);
                                try {
                                    const fd = new FormData();
                                    fd.append('image', file);
                                    const result = await usersService.uploadBanner(fd);
                                    toast.success('Banner updated');
                                    onProfileUpdate({ ...profile, banner: result.banner });
                                    updateUser({ banner: result.banner });
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to upload banner');
                                } finally {
                                    setBannerUploading(false);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('banner-upload').click()}
                            disabled={bannerUploading}
                        >
                            {bannerUploading ? 'Uploading...' : 'Change Banner'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 -mt-16">
                <div className="flex justify-between items-end mb-4">
                    <Avatar className="h-32 w-32 border-4 border-background">
                        <AvatarImage src={profile?.profilePicture} alt={profile?.name} />
                        <AvatarFallback className="text-3xl">{getInitials(profile?.name)}</AvatarFallback>
                    </Avatar>

                    <div>
                        {isOwnProfile ? (
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 5 * 1024 * 1024) {
                                            toast.error('Image size should be less than 5MB');
                                            return;
                                        }
                                        setAvatarUploading(true);
                                        try {
                                            const fd = new FormData();
                                            fd.append('image', file);
                                        const result = await usersService.uploadProfilePicture(fd);
                                        toast.success('Profile picture updated');
                                        onProfileUpdate({ ...profile, profilePicture: result.profilePicture });
                                        updateUser({ profilePicture: result.profilePicture });
                                        const updateAuthorAvatar = usePostsStore.getState().updateAuthorAvatar;
                                        updateAuthorAvatar(user._id, result.profilePicture);
                                        } catch (err) {
                                            toast.error(err.response?.data?.message || 'Failed to upload avatar');
                                        } finally {
                                            setAvatarUploading(false);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                    disabled={avatarUploading}
                                >
                                    {avatarUploading ? 'Uploading...' : 'Change Photo'}
                                </Button>
                                <Button onClick={() => setEditDialogOpen(true)}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleFollow}
                                disabled={followLoading}
                                variant={isFollowing ? 'outline' : 'default'}
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
                </div>

                <div className="space-y-2">
                    <div>
                        <h1 className="text-2xl font-bold">{profile?.name}</h1>
                        <p className="text-muted-foreground">@{profile?.username}</p>
                    </div>

                    {profile?.bio && (
                        <p className="text-sm">{profile.bio}</p>
                    )}

                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="font-semibold">{profile?.followersCount || 0}</span>{' '}
                            <span className="text-muted-foreground">Followers</span>
                        </div>
                        <div>
                            <span className="font-semibold">{profile?.followingCount || 0}</span>{' '}
                            <span className="text-muted-foreground">Following</span>
                        </div>
                    </div>
                </div>
            </div>

            {isOwnProfile && (
                <EditProfileDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    profile={profile}
                    onUpdate={onProfileUpdate}
                />
            )}
        </div>
    );
}
