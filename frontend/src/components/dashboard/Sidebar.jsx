import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Sidebar({ onComputeRoute, showWeather, setShowWeather }) {
    const [origin, setOrigin] = useState("DEL");
    const [destination, setDestination] = useState("BOM");

    const handleCompute = () => {
        if (onComputeRoute) {
            onComputeRoute(origin, destination);
        }
    };

    return (
        <div className="w-80 p-6 border-r border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-6 z-40 relative shadow-[10px_0_30px_rgba(0,0,0,0.5)]">

            <div>
                <h2 className="text-xl font-light tracking-tight text-white mb-1">Flight Control</h2>
                <p className="text-xs text-white/40 font-light mb-6">Configure pathfinding parameters</p>
            </div>

            <div className="flex flex-col gap-5">
                {/* Origin */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-medium ml-1">Origin Node (IATA)</label>
                    <Input 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-1 focus-visible:ring-white/30 rounded-xl" 
                        placeholder="e.g. DEL" 
                    />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-medium ml-1">Terminal Node (IATA)</label>
                    <Input 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value.toUpperCase())}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-1 focus-visible:ring-white/30 rounded-xl" 
                        placeholder="e.g. LHR" 
                    />
                </div>
            </div>

            <div className="h-px bg-white/10 w-full my-2"></div>

            {/* Toggles */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between group">
                    <span className="text-sm font-light text-white/70 group-hover:text-white transition-colors">Weather Matrix Layer</span>
                    <Switch 
                        checked={showWeather}
                        onCheckedChange={setShowWeather}
                        className="data-[state=checked]:bg-indigo-500" 
                    />
                </div>

                <div className="flex items-center justify-between group">
                    <span className="text-sm font-light text-white/70 group-hover:text-white transition-colors">Airspace Restrictions</span>
                    <Switch className="data-[state=checked]:bg-indigo-500" />
                </div>
            </div>

            <div className="mt-auto pt-6">
                {/* Button */}
                <Button 
                    onClick={handleCompute}
                    className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl text-sm font-medium tracking-wide transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    Compute Optimal Path
                </Button>
            </div>

        </div>
    );
}