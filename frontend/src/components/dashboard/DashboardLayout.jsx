import { useState } from "react";
import Sidebar, { AIRCRAFT_MODELS } from "./Sidebar";
import Topbar from "./Topbar";
import MapView from "../map/MapView";
import RoutePanel from "../route/RoutePanel";
import TelemetryPanel from "./TelemetryPanel";
import AnalyticsDashboard from "./AnalyticsDashboard"; // 👈 IMPORTED THE NEW DASHBOARD
import { getAirportData } from "../../utils/airports";
import { getRoute, getWeather } from "../../services/api";

export default function DashboardLayout() {
    // Top-level state for the flight route & map layers
    const [activeRoute, setActiveRoute] = useState({
        origin: getAirportData("DEL"),
        destination: getAirportData("BOM")
    });

    const [aiRouteData, setAiRouteData] = useState(null);
    const [isComputingBackend, setIsComputingBackend] = useState(false);
    const [aircraft, setAircraft] = useState(AIRCRAFT_MODELS[0]);
    const [showWeather, setShowWeather] = useState(false);
    const [showTraffic, setShowTraffic] = useState(false);
    const [destinationWeather, setDestinationWeather] = useState(null);
    const [selectedPath, setSelectedPath] = useState('alpha');

    // 🔀 NEW: State to toggle between Map and Analytics views
    const [currentView, setCurrentView] = useState("map");

    const handleComputeRoute = async (originCode, destCode) => {
        const originData = getAirportData(originCode);
        const destData = getAirportData(destCode);

        if (originData && destData) {
            setActiveRoute({ origin: originData, destination: destData });
            setIsComputingBackend(true);
            setAiRouteData(null);
            setSelectedPath('alpha');

            try {
                const backendData = await getRoute(originCode, destCode);
                setAiRouteData(backendData);

                const weatherData = await getWeather(destData.coordinates[0], destData.coordinates[1]);
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
                    showTraffic={showTraffic}
                    setShowTraffic={setShowTraffic}
                    aircraft={aircraft}
                    setAircraft={setAircraft}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />

                <div className="flex-1 relative flex flex-col">
                    {/* 🔀 CONDITIONAL RENDERING: Show Map OR Analytics */}
                    {currentView === "map" ? (
                        <>
                            <TelemetryPanel activeRoute={activeRoute} aircraft={aircraft} />
                            <MapView
                                activeRoute={activeRoute}
                                aiRouteData={aiRouteData}
                                showWeather={showWeather}
                                showTraffic={showTraffic}
                                destinationWeather={destinationWeather}
                                selectedPath={selectedPath}
                            />
                        </>
                    ) : (
                        <AnalyticsDashboard />
                    )}
                </div>
            </div>

            {/* Only show RoutePanel if we are looking at the Map */}
            {currentView === "map" && (
                <RoutePanel
                    activeRoute={activeRoute}
                    aiRouteData={aiRouteData}
                    isComputing={isComputingBackend}
                    aircraft={aircraft}
                    selectedPath={selectedPath}
                    setSelectedPath={setSelectedPath}
                />
            )}
        </div>
    );
}