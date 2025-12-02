import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
            {/* Animated Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-purple-600/40 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-600/40 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-600/40 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-cyan-600/40 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <LoginForm />
            </div>
        </div>
    );
}
