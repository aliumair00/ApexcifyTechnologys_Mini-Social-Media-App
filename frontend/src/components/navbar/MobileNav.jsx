import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Home, Search, PlusSquare, User, LogOut, Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        setOpen(false);
    };

    const NavLink = ({ to, icon: Icon, children }) => (
        <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setOpen(false)}
        >
            <Link to={to} className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                {children}
            </Link>
        </Button>
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                    <div className="flex flex-col gap-1">
                        <NavLink to="/" icon={Home}>
                            Home
                        </NavLink>
                        <NavLink to="/search" icon={Search}>
                            Search
                        </NavLink>
                        <NavLink to="/" icon={PlusSquare}>
                            Create Post
                        </NavLink>
                        <NavLink to={`/profile/${user?.username}`} icon={User}>
                            Profile
                        </NavLink>
                    </div>
                    <Separator className="my-2" />
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
