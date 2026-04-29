export default function WeatherPanel({ weatherData }) {
    if (!weatherData) return null;

    // Safety check for OpenWeatherMap API errors (e.g. Invalid API Key or missing data)
    // OWM can return `cod` as an Int (401) or a String ("404").
    if (weatherData.cod && Number(weatherData.cod) !== 200) {
        return (
            <div className="absolute top-6 right-6 z-[1000] w-72 bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 shadow-2xl text-white">
                <h3 className="text-red-400 font-medium mb-1">Weather API Error</h3>
                <p className="text-sm text-white/70">{weatherData.message || "Failed to fetch weather data."}</p>
            </div>
        );
    }

    if (!weatherData.main || !weatherData.weather || !weatherData.wind) {
        return null;
    }

    // Date formatting
    const dateOpts = { weekday: 'long', month: 'short', day: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-US', dateOpts);

    const { name, main, weather, wind } = weatherData;
    const tempC = Math.round(main.temp);
    const description = weather[0]?.description || "Unknown";
    const iconId = weather[0]?.icon;
    const iconUrl = iconId ? `https://openweathermap.org/img/wn/${iconId}@2x.png` : null;

    return (
        <div className="absolute top-6 right-6 z-[1000] animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-72 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-white overflow-hidden relative">
                
                {/* Decorative glowing orb in background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none"></div>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-light tracking-tight">{name}</h3>
                        <p className="text-xs text-white/50 tracking-wider uppercase font-medium">{todayStr}</p>
                    </div>
                    {iconUrl && (
                        <div className="w-12 h-12 -mt-2 -mr-2 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                            <img src={iconUrl} alt="Weather Icon" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-extralight tracking-tighter">{tempC}°</span>
                    <span className="text-sm text-white/50 font-medium">C</span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/50 font-light">Condition</span>
                        <span className="capitalize font-medium text-white/90">{description}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-white/50 font-light">Wind Speed</span>
                        <span className="font-medium text-white/90">{wind.speed} m/s</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white/50 font-light">Humidity</span>
                        <span className="font-medium text-white/90">{main.humidity}%</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
