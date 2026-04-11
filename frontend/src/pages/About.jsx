import { motion } from "framer-motion";
import { Plane, Rocket, ShieldCheck, Zap, Github, Linkedin, Twitter, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";

export default function About() {
  const team = [
    {
      name: "Suraj Kumar Agrahari",
      role: "Co-Creator & Lead Architect",
      bio: "Spearheading the core infrastructure, routing algorithms, and system integration for the AeroNexus platform.",
      initials: "SA",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      name: "Md. Tabish Farhan",
      role: "Co-Creator & Lead Developer",
      bio: "Driving the dynamic user interface, real-time matrix rendering, and cloud architecture implementation.",
      initials: "TF",
      gradient: "from-violet-500 to-fuchsia-400"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pb-20 pt-32">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm mb-6">
            <Plane className="w-4 h-4 text-white/70" />
            <span className="text-sm font-light tracking-widest text-white/80 uppercase">Mission Control</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
            About <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AeroNexus</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 font-light leading-relaxed">
            AeroNexus is a next-generation flight intelligence platform. We unite high-performance pathfinding algorithms with real-time global weather integration to redefine modern aviation management and efficiency.
          </p>
        </motion.div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            { icon: Rocket, title: "Advanced Pathfinding", desc: "Applying complex graph algorithms like Dijkstra's to dynamically compute the most optimal global flight paths." },
            { icon: Zap, title: "Real-Time Telemetry", desc: "Synchronizing global atmospheric variables, turbulence overlays, and dynamic wind-shear constraints instantly." },
            { icon: ShieldCheck, title: "Safety Protocol", desc: "Rigorous pre-flight validation protocols ensuring absolutely secure passage around high-risk restricted airspace." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/5">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* The Team Section */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
             <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 flex items-center justify-center gap-4">
                <Users className="w-8 h-8 text-blue-400" />
                The Innovators
             </h2>
             <p className="text-white/60 font-light">The core engineering squad behind the AeroNexus architecture.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-8 hover:bg-white/10 transition-all duration-500">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${member.gradient} opacity-20 blur-[50px] group-hover:opacity-40 transition-opacity`} />
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
                    <div className={`w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${member.gradient} text-black font-bold text-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border-2 border-white/20`}>
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-blue-400 font-mono text-sm tracking-wider uppercase mb-3">{member.role}</p>
                      <p className="text-white/70 font-light text-sm leading-relaxed mb-4">{member.bio}</p>
                      
                      <div className="flex gap-3">
                        <Link to="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <Github className="w-4 h-4" />
                        </Link>
                        <Link to="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </Link>
                        <Link to="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <Twitter className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
