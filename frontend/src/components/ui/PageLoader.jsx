export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial glow behind loader */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Animated squares */}
      <div className="relative w-24 h-24 rotate-45 z-10">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-7 h-7 m-0.5 bg-white animate-square"
            style={{ animationDelay: `${-1.4285714286 * i}s` }}
          />
        ))}
      </div>

      {/* Branding + loading text */}
      <div className="relative z-10 flex flex-col items-center gap-3 mt-10">
        <span className="text-lg font-semibold tracking-tight text-white">
          Aero<span className="text-blue-500">Nexus</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-widest uppercase text-white/40">
            Loading
          </span>
          <div className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes square-animation {
          0%    { left: 0;    top: 0;    }
          10.5% { left: 0;    top: 0;    }
          12.5% { left: 32px; top: 0;    }
          23%   { left: 32px; top: 0;    }
          25%   { left: 64px; top: 0;    }
          35.5% { left: 64px; top: 0;    }
          37.5% { left: 64px; top: 32px; }
          48%   { left: 64px; top: 32px; }
          50%   { left: 32px; top: 32px; }
          60.5% { left: 32px; top: 32px; }
          62.5% { left: 32px; top: 64px; }
          73%   { left: 32px; top: 64px; }
          75%   { left: 0;    top: 64px; }
          85.5% { left: 0;    top: 64px; }
          87.5% { left: 0;    top: 32px; }
          98%   { left: 0;    top: 32px; }
          100%  { left: 0;    top: 0;    }
        }
        .animate-square {
          animation: square-animation 10s ease-in-out infinite both;
        }
      `}</style>
    </div>
  );
}
