import { useState, useEffect } from "react";
import { Activity, Navigation, Wind } from "lucide-react";

export default function TelemetryPanel({ activeRoute, aircraft }) {
    const [telemetry, setTelemetry] = useState({
        altitude: 0,
        speed: 0,
        heading: 0,
    });

    const [isAscending, setIsAscending] = useState(true);

    useEffect(() => {
        // Reset and mock takeoff when route/aircraft changes
        setTelemetry({ altitude: 0, speed: 0, heading: Math.floor(Math.random() * 360) });
        setIsAscending(true);

        const targetAltitude = aircraft.maxAltitude || 36000;
        const targetSpeed = aircraft.cruiseSpeed || 850;

        const interval = setInterval(() => {
            setTelemetry(prev => {
                let newAlt = prev.altitude;
                let newSpeed = prev.speed;
                
                // Simulate ascent/cruise dynamics
                if (newAlt < targetAltitude) {
                    newAlt += Math.floor(Math.random() * 800) + 200;
                    if (newAlt > targetAltitude) newAlt = targetAltitude;
                } else {
                    // Fluctuate altitude slightly during cruise
                    newAlt = targetAltitude + (Math.floor(Math.random() * 100) - 50);
                }

                if (newSpeed < targetSpeed) {
                    newSpeed += Math.floor(Math.random() * 15) + 5;
                    if (newSpeed > targetSpeed) newSpeed = targetSpeed;
                } else {
                    newSpeed = targetSpeed + (Math.floor(Math.random() * 10) - 5);
                }

                return { altitude: newAlt, speed: newSpeed, heading: prev.heading };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeRoute, aircraft]);

    return (
        <div className="absolute top-6 left-6 z-40 animate-in fade-in slide-in-from-left-4 duration-500 pointer-events-none">
            <div className="w-64 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-[30px]" />

                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <h3 className="text-[10px] font-bold tracking-widest uppercase text-white/50 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        Live Telemetry
                    </h3>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-4">
                    {/* Altitude */}
                    <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Altitude (ASL)</span>
                            <span className="font-mono text-emerald-400">FL{Math.floor(telemetry.altitude / 100)}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light text-white tracking-tight">{telemetry.altitude.toLocaleString()}</span>
                            <span className="text-xs text-white/40">ft</span>
                        </div>
                        {/* Dynamic Bar */}
                        <div className="h-1 w-full bg-white/10 mt-1 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/50" style={{ width: `${(telemetry.altitude / 45000) * 100}%` }} />
                        </div>
                    </div>

                    {/* Speed */}
                    <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Ground Speed</span>
                            <span className="font-mono text-blue-400">M {((telemetry.speed / 1225)).toFixed(2)}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light text-white tracking-tight">{telemetry.speed}</span>
                            <span className="text-xs text-white/40">km/h</span>
                        </div>
                    </div>

                    {/* Heading & Config */}
                    <div className="flex gap-2">
                        <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2">
                            <Wind className="w-3 h-3 text-white/40 mb-1" />
                            <div className="text-xs text-white font-mono">{String(telemetry.heading).padStart(3, '0')}° HDG</div>
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/5 rounded-lg p-2">
                            <Navigation className="w-3 h-3 text-white/40 mb-1" />
                            <div className="text-xs text-white font-mono truncate">{aircraft.model || 'A/C'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
