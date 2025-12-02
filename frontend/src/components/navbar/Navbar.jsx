import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Search, PlusSquare, User, LogOut, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileNav from './MobileNav';

export default function Navbar() {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?';
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent ml-4 ">
                            SocialApp 
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex item-center  gap-2  absolute left-1/3  ">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/search" className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Search
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/" className="flex items-center gap-2">
                                <PlusSquare className="h-4 w-4" />
                                Create
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    {/* Desktop User Menu */}
                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                        <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            @{user?.username}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={`/profile/${user?.username}`} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </nav>
    );
}
