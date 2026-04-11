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

            // Fetch live API conditions for HUD Panel
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${destData.coordinates[0]}&lon=${destData.coordinates[1]}&units=metric&appid=${apiKey}`;
                const res = await fetch(url);
                const data = await res.json();
                
                // Set the exact city name so it replaces 'London' or generic lat/lng
                data.name = destData.name; 
                setDestinationWeather(data);
            } catch (err) {
                console.error("Failed to fetch destination conditions for HUD:", err);
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
                    <MapView 
                        activeRoute={activeRoute} 
                        showWeather={showWeather}
                        destinationWeather={destinationWeather}
                    />
                </div>
            </div>

            <RoutePanel activeRoute={activeRoute} aircraft={aircraft} />
        </div>
    );
}