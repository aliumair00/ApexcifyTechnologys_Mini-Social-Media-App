import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import Navbar from '@/components/navbar/Navbar';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import PostDetails from '@/pages/PostDetails';
import Search from '@/pages/Search';

const PrivateRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const Layout = () => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export const routes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <Home />,
                    },
                    {
                        path: '/profile/:username',
                        element: <Profile />,
                    },
                    {
                        path: '/post/:postId',
                        element: <PostDetails />,
                    },
                    {
                        path: '/search',
                        element: <Search />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
];
