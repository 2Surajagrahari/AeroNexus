import React from "react";
import { Link } from "react-router-dom";
import { LogoCloud } from "../components/logo-cloud-3";
import GalleryHoverCarousel from "../components/gallery-hover-carousel";
import { TestimonialsColumn } from "../components/testimonials-columns-1";
import FeaturedSectionStats from "../components/featured-section-stats";

const Button = React.forwardRef(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icons
const ArrowRight = ({
  className = "",
  size = 16
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Menu = ({
  className = "",
  size = 24
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({
  className = "",
  size = 24
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Navigation Component
const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-white">Aero<span className="text-blue-500">Nexus</span></Link>
          
          <div
            className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              className="text-sm text-white/60 hover:text-white transition-colors">
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link
              to="/about"
              className="text-sm text-white/60 hover:text-white transition-colors">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button type="button" variant="default" size="sm">
                Launch App
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-[slideDown_0.3s_ease-out]">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link
              to="/about"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Link to="/dashboard">
                <Button type="button" variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button type="button" variant="default" size="sm">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

// Hero Component
const Hero = React.memo(() => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24"
      style={{
        animation: "fadeIn 0.6s ease-out"
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <aside
        className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full">
        <span
          className="text-xs text-center whitespace-nowrap"
          style={{ color: '#9ca3af' }}>
          AI-Powered Flight Path Optimization
        </span>
        <Link
          to="/about"
          className="flex items-center gap-1 text-xs hover:text-white transition-all active:scale-95 whitespace-nowrap"
          style={{ color: '#9ca3af' }}
          aria-label="Learn more about AeroNexus">
          Learn more
          <ArrowRight size={12} />
        </Link>
      </aside>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-6 leading-tight mb-6"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em"
        }}>
        Smarter Skies, <br />Optimized Flights
      </h1>
      <p
        className="text-sm md:text-base text-center max-w-2xl px-6 mb-10"
        style={{ color: '#9ca3af' }}>
        AeroNexus combines advanced pathfinding algorithms with real-time <br />weather data and ML to compute the safest, most fuel-efficient flight routes.
      </p>
      <div className="flex items-center gap-4 relative z-10 mb-16">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          className="rounded-lg flex items-center justify-center"
          aria-label="Launch the AeroNexus dashboard"
          onClick={() => window.location.href = '/dashboard'}>
          Launch Dashboard
        </Button>
      </div>
      <div className="w-full max-w-5xl relative pb-20">
        <div
          className="absolute left-1/2 w-[90%] pointer-events-none z-0"
          style={{
            top: "-23%",
            transform: "translateX(-50%)"
          }}
          aria-hidden="true">
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt=""
            className="w-full h-auto"
            loading="eager" />
        </div>
        
        <div className="relative z-10">
          <img
            src="https://i.postimg.cc/SKcdVTr1/Dashboard2.png"
            alt="AeroNexus dashboard preview showing flight route optimization"
            className="w-full h-auto rounded-lg shadow-2xl"
            loading="eager" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

// Logo Cloud Data
const aviationLogos = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", alt: "TensorFlow", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", alt: "MongoDB", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", alt: "C++", height: 20, width: 80 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker", height: 20, width: 80 },
];

// Main Component
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />

      {/* Gallery Hover Carousel */}
      <GalleryHoverCarousel heading="Core Modules" />

      {/* Infinite Logo Slider */}
      <section className="relative py-16 bg-black border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-center text-xs uppercase tracking-widest mb-8"
            style={{ color: '#6b7280' }}>
            Powered by modern technologies
          </p>
          <LogoCloud logos={aviationLogos} />
        </div>
      </section>

      {/* Featured Stats Section */}
      <section className="relative bg-black border-t border-gray-800/50">
        <FeaturedSectionStats />
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <aside className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <span className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>
                What People Say
              </span>
            </aside>
            <h2
              className="text-3xl md:text-5xl font-medium mb-4"
              style={{
                background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em"
              }}>
              Trusted by Aviation Professionals
            </h2>
            <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
              Hear from engineers, pilots, and analysts who rely on AeroNexus for smarter flight operations.
            </p>
          </div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px]">
            <TestimonialsColumn
              duration={15}
              testimonials={[
                { text: "AeroNexus cut our route planning time by 70%. The A* algorithm integration is incredibly fast and accurate.", image: "https://randomuser.me/api/portraits/men/32.jpg", name: "Capt. Rajesh Menon", role: "Senior Pilot, AirConnect" },
                { text: "The real-time weather overlay on the route map has been a game-changer for our dispatch operations.", image: "https://randomuser.me/api/portraits/women/44.jpg", name: "Priya Sharma", role: "Flight Dispatcher" },
                { text: "We've seen a 15% reduction in fuel costs since integrating AeroNexus into our fleet management.", image: "https://randomuser.me/api/portraits/men/65.jpg", name: "David Chen", role: "Operations Manager, SkyLine" },
              ]}
            />
            <TestimonialsColumn
              className="hidden md:block"
              duration={19}
              testimonials={[
                { text: "The ML-based delay prediction model has been remarkably accurate. Our on-time performance improved by 12%.", image: "https://randomuser.me/api/portraits/women/68.jpg", name: "Dr. Sarah Mitchell", role: "Data Scientist, AviaTech" },
                { text: "Beautiful dashboard UI with powerful analytics. AeroNexus makes complex aviation data actually understandable.", image: "https://randomuser.me/api/portraits/men/41.jpg", name: "Arjun Patel", role: "Aviation Analyst" },
                { text: "The safety validation layer gives us confidence. No more manually checking restricted airspace zones.", image: "https://randomuser.me/api/portraits/women/29.jpg", name: "Lisa Wong", role: "Safety Officer, JetStream" },
              ]}
            />
            <TestimonialsColumn
              className="hidden lg:block"
              duration={17}
              testimonials={[
                { text: "Integrating AeroNexus with our existing systems was seamless. The API is well-documented and reliable.", image: "https://randomuser.me/api/portraits/men/22.jpg", name: "Mikhail Petrov", role: "CTO, AeroOps" },
                { text: "From turbulence avoidance to fuel optimization — AeroNexus handles it all in one unified platform.", image: "https://randomuser.me/api/portraits/women/55.jpg", name: "Elena Garcia", role: "Route Planner, GlobalAir" },
                { text: "The graph-based airspace modeling is unlike anything else on the market. Truly next-generation.", image: "https://randomuser.me/api/portraits/men/78.jpg", name: "Prof. James Wright", role: "Aerospace Engineering, MIT" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}