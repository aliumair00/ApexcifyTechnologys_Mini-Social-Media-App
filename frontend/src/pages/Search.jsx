import { useState, useCallback } from 'react';
import SearchBar from '@/components/search/SearchBar';
import UserCard from '@/components/search/UserCard';
import { usersService } from '@/services/users';
import { toast } from 'sonner';

export default function Search() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const data = await usersService.searchUsers(query);
            setUsers(data);
        } catch (error) {
            toast.error('Failed to search users');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="container max-w-2xl py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-4">Search Users</h1>
                <SearchBar onSearch={handleSearch} />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-muted-foreground">Searching...</p>
                ) : users.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        {users.length === 0 && !loading ? 'Search for users by username' : 'No users found'}
                    </p>
                ) : (
                    users.map((user) => <UserCard key={user._id} user={user} />)
                )}
            </div>
        </div>
    );
}
