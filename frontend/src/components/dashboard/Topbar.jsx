import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, LogOutIcon } from "lucide-react";
import { getUserProfile } from "../../services/api";

export default function Topbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Ask the backend for the user's data
                const userData = await getUserProfile();
                setUser(userData);
            } catch (error) {
                console.error("Session expired or invalid.");
                // If the token is fake or expired, boot them back to login
                localStorage.removeItem("aeronexus_token");
                navigate("/login");
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("aeronexus_token");
        navigate("/");
    };

    return (
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/40 backdrop-blur-md z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

            {/* Left Side - Logo & System Status */}
            <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-extralight tracking-tight text-white hover:text-white/80 transition-colors">
                    Aero<span className="font-medium text-blue-500">Nexus</span>
                </Link>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">Live Routing</span>
                </div>
            </div>

            {/* Right Side - Dynamic User Profile */}
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-white">{user.username}</span>
                            <span className="text-xs text-gray-500 font-mono tracking-wider">{user.email}</span>
                        </div>

                        <div className="h-9 w-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <UserIcon className="w-5 h-5" />
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <LogOutIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Logout
                        </button>
                    </div>
                ) : (
                    // Loading skeleton while fetching data
                    <div className="h-8 w-32 bg-white/5 animate-pulse rounded-md"></div>
                )}
            </div>

        </div>
    );
}