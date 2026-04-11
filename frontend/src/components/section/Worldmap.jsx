"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "framer-motion";

export function WorldMapDemo() {
    return (
        <div className="dark py-20 md:py-32 bg-black w-full min-h-screen text-white relative">
            {/* Blend Gradient to seamlessly attach to Hero section */}
            <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none z-10" />

            <div className="max-w-7xl mx-auto text-center relative z-20">
                <p className="font-extralight text-3xl md:text-5xl tracking-tight text-white">
                    Global{" "}
                    <span className="text-neutral-400">
                        {"Flight Paths".split("").map((word, idx) => (
                            <motion.span
                                key={idx}
                                className="inline-block"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: idx * 0.04 }}
                            >
                                {word === " " ? "\u00A0" : word}
                            </motion.span>
                        ))}
                    </span>
                </p>
                <p className="text-base font-light tracking-tight text-white/75 max-w-2xl mx-auto mt-6 mb-12">
                    AeroNexus is a high-performance aviation route optimization platform that computes fuel-efficient and weather-safe flight paths using C++ algorithms, geospatial data, and machine learning models.
                </p>
            </div>
            <WorldMap
                dots={[
                    {
                        start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks (FAI)" },
                        end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles (LAX)" },
                    },
                    {
                        start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks (FAI)" },
                        end: { lat: -15.7975, lng: -47.8919, label: "Brasília (BSB)" },
                    },
                    {
                        start: { lat: -15.7975, lng: -47.8919, label: "Brasília (BSB)" },
                        end: { lat: 38.7223, lng: -9.1393, label: "Lisbon (LIS)" },
                    },
                    {
                        start: { lat: 51.5074, lng: -0.1278, label: "London (LHR)" },
                        end: { lat: 28.6139, lng: 77.209, label: "New Delhi (DEL)" },
                    },
                    {
                        start: { lat: 28.6139, lng: 77.209, label: "New Delhi (DEL)" },
                        end: { lat: 43.1332, lng: 131.9113, label: "Vladivostok (VVO)" },
                    },
                    {
                        start: { lat: 28.6139, lng: 77.209, label: "New Delhi (DEL)" },
                        end: { lat: -1.2921, lng: 36.8219, label: "Nairobi (NBO)" },
                    },
                ]}
            />
        </div>
    );
}
