"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function FeaturedSectionStats() {
  const data = [
    { name: "Jan", flights: 1200 },
    { name: "Feb", flights: 1800 },
    { name: "Mar", flights: 2400 },
    { name: "Apr", flights: 3100 },
    { name: "May", flights: 4200 },
    { name: "Jun", flights: 5800 },
    { name: "Jul", flights: 7600 },
  ];

  const stats = [
    { value: "50,000+", label: "Routes Optimized" },
    { value: "99.9%", label: "System Uptime" },
    { value: "18%", label: "Avg. Fuel Saved" },
    { value: "<0.8s", label: "Route Compute Time" },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto text-left py-24 px-6">
      <h3
        className="text-xl sm:text-2xl lg:text-4xl font-medium text-white mb-16"
        style={{ letterSpacing: "-0.03em" }}
      >
        Powering aviation teams with real-time intelligence.{" "}
        <span className="text-gray-500 text-xl sm:text-2xl lg:text-4xl">
          Our next-gen flight analytics engine helps airlines track performance,
          avoid delays, and make data-driven decisions in seconds.
        </span>
      </h3>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-8">
        {stats.map((stat, i) => (
          <div key={i} className="border-l border-gray-700/60 pl-5">
            <p
              className="text-3xl lg:text-4xl font-medium text-white"
              style={{ letterSpacing: "-0.04em" }}
            >
              {stat.value}
            </p>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <div className="w-full h-52 mt-12 rounded-xl overflow-hidden border border-gray-800/50 bg-gray-900/30 p-4">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          Flight Routes Processed — 2025
        </p>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e5e7eb",
                fontSize: "13px",
              }}
              itemStyle={{ color: "#06b6d4" }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Area
              type="monotone"
              dataKey="flights"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCyan)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
