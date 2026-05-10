import { useEffect, useState } from "react";
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { Activity, ShieldAlert, TrendingDown, Database } from "lucide-react";
import { getAnalytics } from "../../services/api";

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState({ totalFlights: 0, totalHazardsAvoided: 0, databaseStatus: "Connecting..." });
    const [flightData, setFlightData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const json = await getAnalytics();

                setStats(json.stats);

                // Format data for Recharts
                const formattedData = json.recentFlights.map((flight, index) => ({
                    name: `FLT-${index + 1}`,
                    id: flight.id,
                    route: `${flight.origin} ✈️ ${flight.destination}`,
                    alpha: flight.alphaDistance,
                    beta: flight.betaDistance,
                    fuelSaved: Math.round((flight.betaDistance - flight.alphaDistance) * 5.2), // Rough fuel calc
                    risk: flight.delayRisk
                }));

                setFlightData(formattedData);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
                setStats(prev => ({ ...prev, databaseStatus: "Offline" }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
        // Poll every 10 seconds to keep the dashboard live!
        const interval = setInterval(fetchAnalytics, 10000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                <p className="text-emerald-500 animate-pulse font-mono tracking-widest">CONNECTING TO DATABANK...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#0a0a0a] p-8 overflow-y-auto">

            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fleet Analytics</h1>
                    <p className="text-sm font-light text-white/40">Real-time route optimization ROI and hazard mitigation.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <Database size={14} />
                    {stats.databaseStatus}
                </div>
            </div>

            {/* TOP METRICS CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-white/40 mb-1">TOTAL FLIGHTS COMPUTED</p>
                        <p className="text-3xl font-light text-white">{stats.totalFlights}</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-rose-500/20 text-rose-400 rounded-xl">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-white/40 mb-1">HAZARDS AVOIDED</p>
                        <p className="text-3xl font-light text-white">{stats.totalHazardsAvoided}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-mono text-emerald-400/70 mb-1">PROJECTED FUEL SAVED</p>
                        <p className="text-3xl font-medium text-emerald-400">
                            {flightData.reduce((sum, f) => sum + (f.fuelSaved > 0 ? f.fuelSaved : 0), 0).toLocaleString()} <span className="text-sm font-light">kg</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-2 gap-6">

                {/* CHART 1: Distance Comparison */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-80">
                    <h3 className="text-sm font-medium text-white/70 mb-6">Alpha vs Beta Route Distance (km)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={flightData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="beta" name="Beta (Raw)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} />
                            <Line type="monotone" dataKey="alpha" name="Alpha (Optimized)" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4, fill: '#06b6d4' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* CHART 2: AI Risk Assessment */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-80">
                    <h3 className="text-sm font-medium text-white/70 mb-6">AI Delay Risk Predictions (%)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={flightData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="route" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="risk" name="Delay Risk %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}