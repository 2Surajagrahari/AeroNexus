"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";

export function WorldMap({
  dots = [],
  lineColor = "#0ea5e9"
}) {
  const svgRef = useRef(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#FFFFFF40", // Light colors for the dots
    shape: "circle",
    backgroundColor: "transparent", // Transparent so the div background shows through
  });

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="w-full aspect-[2/1] bg-black rounded-lg relative font-sans overflow-hidden">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none opacity-60"
        alt="world map"
        height={495}
        width={1056}
        draggable={false} 
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 select-none">
        
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const pathD = createCurvedPath(startPoint, endPoint);
          
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  delay: 0.2 * i,
                  ease: "easeOut",
                }}
              />
              <circle r="2.5" fill="#ffffff" filter="url(#glow)">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path={pathD}
                />
              </circle>
            </g>
          );
        })}

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`} 
               className="cursor-pointer transition-all duration-300 pointer-events-auto"
               onMouseEnter={() => dot.start.label && setHoveredPoint({ ...projectPoint(dot.start.lat, dot.start.lng), label: dot.start.label })}
               onMouseLeave={() => setHoveredPoint(null)}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="3.5"
                fill={lineColor}
                filter="url(#glow)"
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="3.5"
                fill={lineColor}
                opacity="0.6">
                <animate attributeName="r" from="3.5" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
            <g key={`end-${i}`}
               className="cursor-pointer transition-all duration-300 pointer-events-auto"
               onMouseEnter={() => dot.end.label && setHoveredPoint({ ...projectPoint(dot.end.lat, dot.end.lng), label: dot.end.label })}
               onMouseLeave={() => setHoveredPoint(null)}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="3.5"
                fill={lineColor}
                filter="url(#glow)"
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="3.5"
                fill={lineColor}
                opacity="0.6">
                <animate attributeName="r" from="3.5" to="12" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        ))}
      </svg>
      {/* Tooltip implementation */}
      {hoveredPoint && (
        <div 
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[130%]"
          style={{
            left: `${(hoveredPoint.x / 800) * 100}%`,
            top: `${(hoveredPoint.y / 400) * 100}%`
          }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="px-4 py-2 rounded-lg backdrop-blur-xl bg-zinc-900/90 border border-zinc-800 text-white text-sm font-semibold tracking-wide whitespace-nowrap shadow-2xl"
          >
            {hoveredPoint.label}
          </motion.div>
        </div>
      )}
    </div>
  );
}
