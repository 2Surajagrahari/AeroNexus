import { Zap, ShieldCheck } from "lucide-react";

export default function RoutePanel() {
    return (
        <div className="h-40 border-t border-white/10 bg-black/80 backdrop-blur-xl px-8 flex items-center gap-6 overflow-x-auto z-50 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

            <div className="flex flex-col justify-center gap-1 min-w-[150px] mr-4">
                <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase">Computed Routes</h2>
                <p className="text-2xl font-extralight tracking-tight text-white">2 <span className="text-sm font-light text-white/40">Found</span></p>
            </div>

            {/* Route A Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 hover:bg-white/10 transition-colors cursor-pointer border border-indigo-500/30 p-5 rounded-2xl min-w-[260px] relative group overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-white tracking-tight">Alpha Path</h3>
                    <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 font-medium">Optimal</div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-light">Distance</span>
                        <span className="font-mono text-white/90">5,400 km</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-light">Fuel Matrix</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
                            <ShieldCheck size={14} /> Highly Efficient
                        </span>
                    </div>
                </div>
            </div>

            {/* Route B Card */}
            <div className="bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 p-5 rounded-2xl min-w-[260px] relative group overflow-hidden opacity-70 hover:opacity-100">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-white tracking-tight">Beta Path</h3>
                    <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-500 font-medium">Alternative</div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-light">Distance</span>
                        <span className="font-mono text-white/90">5,200 km</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-light">Fuel Matrix</span>
                        <span className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                            <Zap size={14} /> High Burn
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}