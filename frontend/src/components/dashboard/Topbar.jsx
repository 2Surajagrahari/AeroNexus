import { Link } from "react-router-dom";

export default function Topbar() {
    return (
        <div className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/40 backdrop-blur-md z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

            <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-extralight tracking-tight text-white hover:text-white/80 transition-colors">
                    Aero<span className="font-medium text-white/50">Nexus</span>
                </Link>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-medium">
                    Live Routing System
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">System Online</span>
                </div>
            </div>

        </div>
    );
}