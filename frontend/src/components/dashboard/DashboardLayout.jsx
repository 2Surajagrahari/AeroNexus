import { useState } from "react";
import Sidebar, { AIRCRAFT_MODELS } from "./Sidebar";
import Topbar from "./Topbar";
import MapView from "../map/MapView";
import RoutePanel from "../route/RoutePanel";
import TelemetryPanel from "./TelemetryPanel";
import { getAirportData } from "../../utils/airports";

export default function DashboardLayout() {
    // Top-level state for the flight route & map layers
    const [activeRoute, setActiveRoute] = useState({
        origin: getAirportData("DEL"),
        destination: getAirportData("BOM")
    });

    // 🧠 NEW: Enterprise Backend State
    const [aiRouteData, setAiRouteData] = useState(null);
    const [isComputingBackend, setIsComputingBackend] = useState(false);

    // Aircraft State
    const [aircraft, setAircraft] = useState(AIRCRAFT_MODELS[0]);

    // Toggle state for Weather Matrix
    const [showWeather, setShowWeather] = useState(false);

    // HUD active weather payload
    const [destinationWeather, setDestinationWeather] = useState(null);

    const handleComputeRoute = async (originCode, destCode) => {
        const originData = getAirportData(originCode);
        const destData = getAirportData(destCode);

        if (originData && destData) {
            setActiveRoute({
                origin: originData,
                destination: destData
            });

            // Start Loading State for UI
            setIsComputingBackend(true);
            setAiRouteData(null);

            try {
                // 🚀 1. THE MAGIC CONNECTION: Fetch A* Route & ML Data from Node/Redis
                const routeResponse = await fetch(`http://localhost:3000/api/route?from=${originCode}&to=${destCode}`);
                if (routeResponse.ok) {
                    const backendData = await routeResponse.json();
                    console.log("🧠 ENTERPRISE BACKEND RESPONSE:", backendData);
                    setAiRouteData(backendData); // Save to state!
                } else {
                    console.error("⚠️ Node backend returned an error.");
                }

                // 🌤️ 2. Fetch live API conditions for HUD Panel (Your friend's original code)
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${destData.coordinates[0]}&lon=${destData.coordinates[1]}&units=metric&appid=${apiKey}`;
                const weatherRes = await fetch(url);
                const weatherData = await weatherRes.json();

                weatherData.name = destData.name;
                setDestinationWeather(weatherData);

            } catch (err) {
                console.error("Failed to fetch backend or weather data:", err);
            } finally {
                setIsComputingBackend(false);
            }
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
            <Topbar />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    onComputeRoute={handleComputeRoute}
                    showWeather={showWeather}
                    setShowWeather={setShowWeather}
                    aircraft={aircraft}
                    setAircraft={setAircraft}
                />

                <div className="flex-1 relative">
                    <TelemetryPanel activeRoute={activeRoute} aircraft={aircraft} />

                    {/* 🗺️ Injected aiRouteData into the Map */}
                    <MapView
                        activeRoute={activeRoute}
                        aiRouteData={aiRouteData}
                        showWeather={showWeather}
                        destinationWeather={destinationWeather}
                    />
                </div>
            </div>

            {/* 📊 Injected aiRouteData and computing status into the Route Panel */}
            <RoutePanel
                activeRoute={activeRoute}
                aiRouteData={aiRouteData}
                isComputing={isComputingBackend}
                aircraft={aircraft}
            />
        </div>
    );
}