"use client";;
import { Sparkles, ArrowRight } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Route Optimization Engine",
    summary: "A* pathfinding with great-circle heuristics for computing optimal multi-waypoint flight routes in real-time.",
    image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Live Weather Integration",
    summary: "Real-time weather overlays including turbulence, wind shear, and storm cells from aviation APIs.",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "ML Delay Prediction",
    summary: "Machine learning models that predict flight delay risks based on weather, traffic, and historical data.",
    image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Fuel Efficiency Analytics",
    summary: "Predictive fuel burn calculations using aircraft weight, altitude profiles, and atmospheric conditions.",
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Safety Validation Layer",
    summary: "Pre-flight validation ensuring safe passage around restricted airspace and hazardous weather zones.",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Global Airspace Graph",
    summary: "Custom-built graph of worldwide airports and airways using geospatial coordinates for precise pathfinding.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop&q=80",
  },
];

export default function GalleryHoverCarousel({ heading = "Core Modules" }) {
  return (
    <section className="py-24 md:py-32 bg-black overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" style={{ color: '#9ca3af' }} />
            <span className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>
              {heading}
            </span>
          </div>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-4"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.04em",
            }}>
            Aviation Intelligence Modules
          </h3>
          <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
            Every module in AeroNexus is purpose-built for aviation intelligence — from graph-based
            routing to ML-driven fuel prediction and real-time weather overlays.
          </p>
        </div>
      </div>

      {/* Marquee Image Cards */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <InfiniteSlider gap={20} duration={30} durationOnHover={60}>
          {modules.map((item, i) => (
            <Link
              to="/dashboard"
              key={i}
              className="group relative flex-shrink-0 w-[320px] md:w-[380px] h-[260px] md:h-[300px] rounded-2xl overflow-hidden border border-gray-800/60 bg-gray-900/40">
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Content on image */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="text-base md:text-lg font-medium text-white mb-1.5 drop-shadow-lg">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm leading-relaxed line-clamp-2 drop-shadow-md" style={{ color: '#d1d5db' }}>
                  {item.summary}
                </p>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-rotate-45">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          ))}
        </InfiniteSlider>
      </div>

      {/* Bottom Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "12,000+", label: "Routes Computed" },
            { value: "98%", label: "Accuracy Rate" },
            { value: "150+", label: "Global Airports" },
            { value: "<3s", label: "Avg. Compute Time" },
          ].map((stat, i) => (
            <div key={i} className="text-center py-4 rounded-xl border border-gray-800/40 bg-gray-900/20">
              <div className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-1">{stat.value}</div>
              <div className="text-xs" style={{ color: '#6b7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
