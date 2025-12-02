import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserPosts from '@/components/profile/UserPosts';
import { usersService } from '@/services/users';
import { postsService } from '@/services/posts';
import { toast } from 'sonner';

export default function Profile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await usersService.getUserProfile(username);
                setProfile(data);
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!profile?._id) return;
            setPostsLoading(true);
            try {
                const data = await postsService.getUserPosts(profile._id);
                setPosts(data);
            } catch (error) {
                toast.error('Failed to load posts');
            } finally {
                setPostsLoading(false);
            }
        };

        fetchUserPosts();
    }, [profile]);

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
        if (updatedProfile?.profilePicture) {
            setPosts((prev) =>
                prev.map((p) =>
                    p.author?._id === updatedProfile._id
                        ? { ...p, author: { ...p.author, profilePicture: updatedProfile.profilePicture } }
                        : p
                )
            );
        }
    };

    const handlePostDeleted = (postId) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    const handlePostUpdated = (postId, updated) => {
        setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, ...updated } : p)));
    };

    if (loading) {
        return (
            <div className="container max-w-4xl py-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container max-w-4xl py-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Profile not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-6 space-y-6">
            <Card>
                <CardContent className="p-0">
                    <ProfileHeader profile={profile} onProfileUpdate={handleProfileUpdate} />
                </CardContent>
            </Card>

            <div>
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <UserPosts
                    posts={posts}
                    loading={postsLoading}
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                />
            </div>
        </div>
    );
}
