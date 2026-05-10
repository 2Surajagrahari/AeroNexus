import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import WeatherPanel from "../dashboard/WeatherPanel";
import { calculateSafeRoute } from "../../utils/flightMath";
import { getTraffic } from "../../services/api";

// ===================== ICON DEFINITIONS =====================
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
const liveTrafficIcon = createGlowingIcon('#f59e0b'); // Amber Glow

// ===================== FLIGHT PATH COMPONENT =====================
// 🔌 ADDED: aiRouteData and selectedPath props
function AnimatedFlightPath({ originCoords, destCoords, aiRouteData, selectedPath }) {
    const map = useMap();
    const [planeIndex, setPlaneIndex] = useState(0);
    const [dynamicPositions, setDynamicPositions] = useState([]);

    // 🚀 Instantly updates when you click Alpha or Beta without fetching again!
    useEffect(() => {
        setPlaneIndex(0);

        if (aiRouteData) {
            // Pick the route based on the toggle state!
            const activeBackendRoute = selectedPath === 'alpha'
                ? aiRouteData.alphaRoute
                : aiRouteData.betaRoute;

            if (activeBackendRoute && activeBackendRoute.route) {
                const backendCoords = activeBackendRoute.route.map(node => [node.lat, node.lon]);
                setDynamicPositions(backendCoords);
            }
        } else {
            // Fallback before API loads
            calculateSafeRoute(originCoords, destCoords).then(setDynamicPositions);
        }
    }, [originCoords, destCoords, aiRouteData, selectedPath]);

    useEffect(() => {
        if (dynamicPositions.length === 0) return;
        const interval = setInterval(() => {
            setPlaneIndex((prev) => (prev < dynamicPositions.length - 1 ? prev + 1 : prev));
        }, 100);
        return () => clearInterval(interval);
    }, [dynamicPositions]);

    useEffect(() => {
        if (!map || dynamicPositions.length === 0) return;
        const bounds = L.latLngBounds(dynamicPositions);
        map.fitBounds(bounds, { padding: [100, 100] });
    }, [map, dynamicPositions]);

    if (dynamicPositions.length === 0) return null;

    // 🎨 Changes color: Cyan for Alpha, Orange for Beta!
    const lineColor = selectedPath === 'alpha' ? "#06b6d4" : "#f97316";

    return (
        <>
            <Polyline positions={dynamicPositions} pathOptions={{ color: "rgba(255, 255, 255, 0.1)", weight: 3 }} />
            <Polyline
                positions={dynamicPositions}
                pathOptions={{
                    color: lineColor,
                    weight: 3,
                    opacity: 0.8,
                    dashArray: "15, 20",
                    className: "animated-flight-path"
                }}
            />
            {dynamicPositions.length > 0 && dynamicPositions[planeIndex] && (
                <Marker position={dynamicPositions[planeIndex]} icon={planeIcon} />
            )}
        </>
    );
}

// ===================== MAIN MAP COMPONENT =====================
// 🔌 ADDED: aiRouteData and selectedPath props
export default function MapView({ activeRoute, aiRouteData, showWeather, showTraffic, destinationWeather, selectedPath }) {

    const origin = activeRoute?.origin;
    const destination = activeRoute?.destination;
    const centerCoord = origin ? origin.coordinates : [20, 77]; // Default to India

    // 🛰️ STATE FOR LIVE PLANES
    const [livePlanes, setLivePlanes] = useState([]);

    // 📡 FETCH TRAFFIC EVERY 15 SECONDS
    useEffect(() => {
        if (!showTraffic) {
            setLivePlanes([]); // Clear map if toggled off
            return;
        }

        const fetchTraffic = async () => {
            try {
                const json = await getTraffic();
                if (json.data) setLivePlanes(json.data);
            } catch (err) {
                console.error("⚠️ Live traffic failed:", err);
            }
        };

        fetchTraffic(); // Fetch immediately on toggle
        const interval = setInterval(fetchTraffic, 15000); // Poll every 15s

        return () => clearInterval(interval);
    }, [showTraffic]);

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

                {/* Optional Weather Overlay */}
                {showWeather && (
                    <TileLayer
                        url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_WEATHER_API_KEY}`}
                        opacity={0.65}
                    />
                )}

                {/* 🛰️ RENDER LIVE PLANES */}
                {showTraffic && livePlanes.map(plane => (
                    <Marker
                        key={plane.id}
                        position={[plane.lat, plane.lon]}
                        icon={liveTrafficIcon}
                    >
                        <Popup>
                            <div className="font-mono text-[10px] text-amber-500 mb-1 tracking-widest">LIVE FLIGHT</div>
                            <div className="text-lg font-medium text-white mb-2">{plane.callsign}</div>
                            <div className="text-xs font-light text-white/70">Altitude: {Math.round(plane.altitude_m * 3.28084)} ft</div>
                            <div className="text-xs font-light text-white/70">Speed: {Math.round(plane.velocity_ms * 3.6)} km/h</div>
                            <div className="text-xs font-light text-white/70 mt-1 border-t border-white/10 pt-1">
                                Country: {plane.country}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Route Markers */}
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

                {/* The Path connecting them */}
                {origin && destination && (
                    <AnimatedFlightPath
                        originCoords={origin.coordinates}
                        destCoords={destination.coordinates}
                        aiRouteData={aiRouteData}
                        selectedPath={selectedPath}
                    />
                )}

            </MapContainer>
        </div>
    );
}