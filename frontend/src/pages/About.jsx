import React from "react";
import { Link } from "react-router-dom";

// Icons
const Rocket = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const Zap = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

const ShieldCheck = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const Github = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Users = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
  </svg>
);

const Plane = ({ className = "", size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

const ArrowRight = ({ className = "", size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

// Data
const capabilities = [
  { icon: Rocket, title: "Advanced Pathfinding", desc: "Applying complex graph algorithms like Dijkstra's to dynamically compute the most optimal global flight paths." },
  { icon: Zap, title: "Real-Time Telemetry", desc: "Synchronizing global atmospheric variables, turbulence overlays, and dynamic wind-shear constraints instantly." },
  { icon: ShieldCheck, title: "Safety Protocol", desc: "Rigorous pre-flight validation protocols ensuring absolutely secure passage around high-risk restricted airspace." },
];

const team = [
  {
    name: "Suraj Kumar Agrahari",
    role: "Co-Creator & Lead Architect",
    bio: "Spearheading the core infrastructure, routing algorithms, and system integration for the AeroNexus platform.",
    initials: "SA",
  },
  {
    name: "Md. Tabish Farhan",
    role: "Co-Creator & Lead Developer",
    bio: "Driving the dynamic user interface, real-time matrix rendering, and cloud architecture implementation.",
    initials: "TF",
  }
];

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header Section ── */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-32 pb-20"
        style={{ animation: "fadeIn 0.6s ease-out" }}>
        <aside className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <Plane className="w-4 h-4" style={{ color: '#9ca3af' }} />
          <span className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>
            Mission Control
          </span>
        </aside>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium max-w-3xl leading-tight mb-6"
          style={{
            background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em"
          }}>
          About AeroNexus
        </h1>

        <p
          className="text-sm md:text-base max-w-2xl px-6 mb-10"
          style={{ color: '#9ca3af' }}>
          AeroNexus is a next-generation flight intelligence platform. We unite <br />
          high-performance pathfinding algorithms with real-time global weather <br />
          integration to redefine modern aviation efficiency.
        </p>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all h-12 px-8 text-base bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95">
            Launch Dashboard
          </Link>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-8 hover:bg-gray-800/40 transition-all duration-300"
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}>
              <div className="w-12 h-12 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm mb-8">
            <Users className="w-4 h-4" style={{ color: '#9ca3af' }} />
            <span className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>
              The Innovators
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}>
            Meet the Team
          </h2>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            The core engineering squad behind the AeroNexus architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-8 hover:bg-gray-800/40 transition-all duration-300"
              style={{ animation: `fadeIn 0.6s ease-out ${idx * 0.15}s both` }}>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-800 border-2 border-gray-700/50 text-white font-bold text-2xl">
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-white">{member.name}</h3>
                  <p className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: '#9ca3af' }}>
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#9ca3af' }}>
                    {member.bio}
                  </p>

                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/50 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-white">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/50 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-white">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/50 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-white">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
