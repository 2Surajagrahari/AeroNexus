import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navbar on dashboard
  if (location.pathname.startsWith("/dashboard")) return null;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-black/60 backdrop-blur-md border-white/10 shadow-lg py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
              <Plane className="w-5 h-5 text-white transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors duration-300">
              Aero<span className="text-blue-500">Nexus</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
            
            <div className="flex gap-4 items-center">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                to="/dashboard" 
                className="group relative px-5 py-2 text-sm font-medium bg-white text-black rounded-full overflow-hidden flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all"
              >
                Launch App
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-2xl font-semibold text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4" />
              <Link 
                to="/login"
                className="text-2xl font-semibold text-gray-300 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="mt-4 py-4 bg-white text-black text-center rounded-xl text-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                Launch Application
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
