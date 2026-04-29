import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import WeatherPanel from "../dashboard/WeatherPanel";

const planeIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
});

const createGlowingIcon = (color) => {
    return L.divIcon({
        className: 'custom-glowing-icon',
        html: `
            <div style="
                width: 16px; 
                height: 16px; 
                background-color: ${color}; 
                border-radius: 50%; 
                box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
                position: relative;
            ">
                <div style="
                    content: '';
                    position: absolute;
                    top: -8px; left: -8px; right: -8px; bottom: -8px;
                    border: 2px solid ${color};
                    border-radius: 50%;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                "></div>
            </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};

const originIcon = createGlowingIcon('#10b981'); // Emerald
const destIcon = createGlowingIcon('#06b6d4'); // Cyan

import { calculateSafeRoute } from "../../utils/flightMath";

// ===================== FLIGHT PATH COMPONENT =====================
function AnimatedFlightPath({ originCoords, destCoords, originId, destId, showWeather }) {
    const map = useMap();
    const [planeIndex, setPlaneIndex] = useState(0);
    const [dynamicPositions, setDynamicPositions] = useState([]);
    const [isComputing, setIsComputing] = useState(false);

    // Compute Math Path Asynchronously using our Node.js Backend!
    useEffect(() => {
        let active = true;
        setPlaneIndex(0);
        setIsComputing(true);

        const computeRoute = async () => {
            try {
                // 1. Ask the Node Server for the Enterprise Route
                // Note: We use the activeRoute's IDs (e.g. "DEL", "CCU")
                // We need to pass originId and destId as props to AnimatedFlightPath!
                const response = await fetch(`http://localhost:3000/api/route?from=${originId}&to=${destId}`);
                const aiData = await response.json();

                console.log("🧠 NODE/AI BACKEND RESPONSE:", aiData);

                if (active) {
                    // Assuming your backend returns an array of coordinates in aiData.data.coordinates
                    // OR if it just returns node IDs, you map them here. 
                    // Let's fallback to the local math ONLY if the server is down.
                    if (aiData && aiData.data && aiData.data.route) {
                        // TODO: If backend returns coordinates array, use it directly!
                        // setDynamicPositions(aiData.data.coordinates);

                        // Temporary fallback until we verify exact backend JSON structure:
                        const backupPath = await calculateSafeRoute(originCoords, destCoords);
                        setDynamicPositions(backupPath);
                    }
                    setIsComputing(false);
                }
            } catch (error) {
                console.error("⚠️ Backend offline! Falling back to local math.", error);
                const backupPath = await calculateSafeRoute(originCoords, destCoords);
                if (active) {
                    setDynamicPositions(backupPath);
                    setIsComputing(false);
                }
            }
        };

        computeRoute();

        return () => {
            active = false;
        };
    }, [originCoords, destCoords, showWeather]);

    // Handle plane animation along the loaded route
    useEffect(() => {
        if (dynamicPositions.length === 0 || isComputing) return;

        const interval = setInterval(() => {
            setPlaneIndex((prev) => {
                if (prev < dynamicPositions.length - 1) return prev + 1;
                return prev; // Stop at destination
            });
        }, 100);

        return () => clearInterval(interval);
    }, [dynamicPositions, isComputing]);

    // Dynamically lock camera on the generated route bounds
    useEffect(() => {
        if (!map || dynamicPositions.length === 0) return;
        const bounds = L.latLngBounds(dynamicPositions);
        map.fitBounds(bounds, { padding: [100, 100] });
    }, [map, dynamicPositions]);

    if (dynamicPositions.length === 0) return null;

    return (
        <>
            {/* Base Line (Faint track) */}
            <Polyline
                positions={dynamicPositions}
                pathOptions={{ color: "rgba(255, 255, 255, 0.1)", weight: 3 }}
            />
            {/* Glowing Animated Dash Line */}
            <Polyline
                positions={dynamicPositions}
                pathOptions={{
                    color: "#06b6d4", // Cyan glow
                    weight: 3,
                    opacity: 0.8,
                    dashArray: "15, 20",
                    className: "animated-flight-path"
                }}
            />
            {dynamicPositions.length > 0 && dynamicPositions[planeIndex] && (
                <Marker
                    position={dynamicPositions[planeIndex]}
                    icon={planeIcon}
                />
            )}
        </>
    );
}

// ===================== MAIN MAP COMPONENT =====================
export default function MapView({ activeRoute, showWeather, destinationWeather }) {

    // We expect activeRoute to have an `origin` and `destination`.
    // We map them gracefully if they exist.
    const origin = activeRoute?.origin;
    const destination = activeRoute?.destination;

    const centerCoord = origin ? origin.coordinates : [20, 77]; // Default to India if no data

    return (
        <div className="w-full h-full relative group">
            {/* Injected Styles for the Map Animations */}
            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .animated-flight-path {
                    stroke-dashoffset: 1000;
                    animation: dash 50s linear infinite;
                    filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.8));
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                /* Hide Leaflet watermark and control borders for a cleaner look */
                .leaflet-control-attribution { display: none !important; }
                .leaflet-bar { border: none !important; box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important; }
                .leaflet-bar a { background-color: rgba(0,0,0,0.6) !important; color: white !important; border: 1px solid rgba(255,255,255,0.1) !important; backdrop-filter: blur(4px); }
                .leaflet-bar a:hover { background-color: rgba(255,255,255,0.1) !important; }
                .leaflet-popup-content-wrapper { 
                    background: rgba(0,0,0,0.8) !important; 
                    color: white !important; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    border-radius: 12px;
                }
                .leaflet-popup-tip { background: rgba(0,0,0,0.8) !important; }
            `}</style>

            {/* Fading vignettes to blend map smoothly into the dashboard borders */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[400]"></div>

            <WeatherPanel weatherData={destinationWeather} />

            <MapContainer
                key={`${origin?.id}-${destination?.id}`} // force re-render when route completely changes
                center={centerCoord}
                zoom={4}
                style={{ height: "100%", width: "100%", backgroundColor: '#000000' }}
                zoomControl={true}
            >
                {/* Extremely Dark High-Contrast Tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />
                {showWeather && (
                    <TileLayer
                        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
                        opacity={0.65}
                    />
                )}
                {origin && (
                    <Marker position={origin.coordinates} icon={originIcon}>
                        <Popup>
                            <div className="font-mono text-xs text-emerald-400 mb-1">ORIGIN NODE</div>
                            <div className="text-lg font-light tracking-tight text-white">{origin.name} ({origin.id})</div>
                        </Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker position={destination.coordinates} icon={destIcon}>
                        <Popup>
                            <div className="font-mono text-xs text-cyan-400 mb-1">TERMINAL NODE</div>
                            <div className="text-lg font-light tracking-tight text-white">{destination.name} ({destination.id})</div>
                        </Popup>
                    </Marker>
                )}

                {origin && destination && (
                    <AnimatedFlightPath
                        originCoords={origin.coordinates}
                        destCoords={destination.coordinates}
                        originId={origin.id}
                        destId={destination.id}
                        showWeather={showWeather}
                    />
                )}

            </MapContainer>
        </div>
    );
}