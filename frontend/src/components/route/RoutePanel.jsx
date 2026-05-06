import { Zap, ShieldCheck, Cpu } from "lucide-react";
import { calculateDistance } from "../../utils/flightMath";

// 🔌 ADDED: selectedPath and setSelectedPath props
export default function RoutePanel({ activeRoute, aircraft, aiRouteData, isComputing, selectedPath, setSelectedPath }) {

    // Fallbacks
    const origin = activeRoute?.origin;
    const dest = activeRoute?.destination;

    let distance = 0;
    if (origin && dest) {
        distance = Math.round(calculateDistance(
            origin.coordinates[0], origin.coordinates[1],
            dest.coordinates[0], dest.coordinates[1]
        ));
    }

    // Dynamic metrics
    const burnEfficiency = aircraft ? (aircraft.efficiency * 100) : 80;
    const fuelBurnHigh = Math.round(distance * 5.2 * (2 - (aircraft?.efficiency || 1)));

    // 🧠 AI Logic Extraction
    const aiPrediction = aiRouteData?.ai_delay_prediction;
    const delayRisk = aiPrediction ? aiPrediction.delay_probability_percent : 0;

    let riskColor = "text-emerald-400";
    let riskText = "Low Congestion";
    if (delayRisk > 75) {
        riskColor = "text-rose-400";
        riskText = "High Congestion";
    } else if (delayRisk > 30) {
        riskColor = "text-amber-400";
        riskText = "Moderate Risk";
    }

    return (
        <div className="h-40 border-t border-white/10 bg-black/80 backdrop-blur-xl px-8 flex items-center gap-6 overflow-x-auto z-50 py-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

            <div className="flex flex-col justify-center gap-1 min-w-[150px] mr-4">
                <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase">Computed Routes</h2>
                {isComputing ? (
                    <p className="text-lg font-extralight tracking-tight text-cyan-400 animate-pulse">Computing AI...</p>
                ) : (
                    <p className="text-2xl font-extralight tracking-tight text-white">{distance > 0 ? '2' : '0'} <span className="text-sm font-light text-white/40">Found</span></p>
                )}
            </div>

            {distance > 0 && (
                <>
                    {/* 🟢 PRIMARY OPTIMAL ROUTE (ALPHA) */}
                    <div
                        onClick={() => setSelectedPath('alpha')}
                        className={`transition-all cursor-pointer border p-5 rounded-2xl min-w-[260px] relative group overflow-hidden ${selectedPath === 'alpha'
                                ? "bg-gradient-to-br from-indigo-500/10 to-emerald-500/5 border-indigo-500/50 opacity-100 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                : "bg-white/5 border-white/10 opacity-50 hover:opacity-80 hover:bg-white/10"
                            }`}
                    >
                        {selectedPath === 'alpha' && (
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-100"></div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium text-white tracking-tight">Alpha Path</h3>
                            <div className="flex gap-2">
                                {/* Show backend weather alert if storms were dodged */}
                                {aiRouteData?.avoidedHazards?.length > 0 && (
                                    <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-400 font-medium">Rerouted</div>
                                )}
                                <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 font-medium">Optimal</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50 font-light">Ground Distance</span>
                                <span className="font-mono text-white/90">
                                    {aiRouteData?.alphaRoute?.totalDistance ? Math.round(aiRouteData.alphaRoute.totalDistance).toLocaleString() : distance.toLocaleString()} km
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50 font-light">Fuel Matrix</span>
                                <span className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
                                    <ShieldCheck size={14} /> {burnEfficiency}% Efficient
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 🟠 SECONDARY ROUTE (BETA) */}
                    <div
                        onClick={() => setSelectedPath('beta')}
                        className={`transition-all cursor-pointer border p-5 rounded-2xl min-w-[260px] relative group overflow-hidden ${selectedPath === 'beta'
                                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/50 opacity-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                : "bg-white/5 border-white/10 opacity-50 hover:opacity-80 hover:bg-white/10"
                            }`}
                    >
                        {selectedPath === 'beta' && (
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-100"></div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium text-white tracking-tight">Beta Path</h3>
                            <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-500 font-medium">Alternative</div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50 font-light">Air Distance</span>
                                <span className="font-mono text-white/90">
                                    {aiRouteData?.betaRoute?.totalDistance ? Math.round(aiRouteData.betaRoute.totalDistance).toLocaleString() : (distance + Math.floor(distance * 0.12)).toLocaleString()} km
                                </span>
                            </div>

                            {/* 🧠 DYNAMIC AI Delay Prediction Injection */}
                            <div className="flex justify-between items-center text-sm mt-1 mb-1">
                                <span className="text-white/50 font-light">AI Delay Risk</span>
                                <span className={`flex items-center gap-1 font-medium text-xs ${riskColor}`}>
                                    <Cpu size={14} className={isComputing ? "animate-pulse" : ""} />
                                    {isComputing ? "Analyzing..." : `${riskText} (${delayRisk}%)`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/50 font-light">Fuel Matrix</span>
                                <span className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                                    <Zap size={14} /> High Burn (~{fuelBurnHigh}kg)
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}