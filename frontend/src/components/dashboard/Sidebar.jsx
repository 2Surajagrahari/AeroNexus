import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plane } from "lucide-react";

export const AIRCRAFT_MODELS = [
    { id: "B777", model: "Boeing 777", cruiseSpeed: 900, maxAltitude: 43000, efficiency: 0.8 },
    { id: "A320", model: "Airbus A320", cruiseSpeed: 828, maxAltitude: 39000, efficiency: 0.9 },
    { id: "C700", model: "Cessna Citation", cruiseSpeed: 850, maxAltitude: 45000, efficiency: 0.6 }
];

export default function Sidebar({ onComputeRoute, showWeather, setShowWeather, aircraft, setAircraft }) {
    const [origin, setOrigin] = useState("DEL");
    const [destination, setDestination] = useState("BOM");

    const handleCompute = () => {
        if (onComputeRoute) {
            onComputeRoute(origin, destination);
        }
    };

    return (
        <div className="w-80 p-6 border-r border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-6 z-40 relative shadow-[10px_0_30px_rgba(0,0,0,0.5)] h-full overflow-y-auto">

            <div>
                <h2 className="text-xl font-light tracking-tight text-white mb-1">Flight Control</h2>
                <p className="text-xs text-white/40 font-light mb-6">Configure pathfinding parameters</p>
            </div>

            {/* Aircraft Selection */}
            <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/50 font-medium ml-1">Aircraft Configuration</label>
                <div className="grid grid-cols-1 gap-2">
                    {AIRCRAFT_MODELS.map(ac => (
                        <div 
                            key={ac.id}
                            onClick={() => setAircraft(ac)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                aircraft.id === ac.id 
                                    ? "bg-indigo-500/20 border-indigo-500/50 text-white" 
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Plane className="w-4 h-4" />
                            <div>
                                <div className="text-sm font-medium">{ac.model}</div>
                                <div className="text-[10px] uppercase tracking-wider opacity-70">Mach {(ac.cruiseSpeed/1225).toFixed(2)} | FL{Math.floor(ac.maxAltitude/100)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/10 w-full my-1"></div>

            <div className="flex flex-col gap-4">
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

            <div className="h-px bg-white/10 w-full my-1"></div>

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

            <div className="mt-auto pt-4">
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