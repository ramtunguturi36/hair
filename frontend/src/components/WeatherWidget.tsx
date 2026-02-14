import React, { useState, useEffect } from 'react';
import { FaSun, FaCloudRain, FaWind, FaMapMarkerAlt } from 'react-icons/fa';

interface WeatherData {
    city: string;
    temp: number;
    humidity: number;
    uvIndex: number;
    condition: string;
}

const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock API call - in a real app, replace with OpenWeatherMap fetch
        const fetchWeather = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data
                setWeather({
                    city: 'Hyderabad', // Default or detected
                    temp: 28,
                    humidity: 65,
                    uvIndex: 8,
                    condition: 'Partly Cloudy'
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load weather');
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getHairAdvice = (humidity: number, uv: number) => {
        if (humidity > 60) return "High humidity! Use anti-frizz serum today.";
        if (uv > 6) return "High UV! Wear a hat or use UV protectant spray.";
        if (humidity < 30) return "Dry air alert! Keep hair moisturized.";
        return "Great hair weather today!";
    };

    if (loading) return <div className="p-4 bg-white rounded-xl shadow-md animate-pulse h-32"></div>;
    if (error || !weather) return null;

    return (
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-4 text-white mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold flex items-center">
                        <FaMapMarkerAlt className="mr-2" /> {weather.city} Hair Forecast
                    </h3>
                    <p className="text-sm opacity-90">{weather.condition}, {weather.temp}°C</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <FaCloudRain /> <span>{weather.humidity}% Hum</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <FaSun /> <span>UV: {weather.uvIndex}</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <p className="font-medium text-sm">
                    💡 {getHairAdvice(weather.humidity, weather.uvIndex)}
                </p>
            </div>
        </div>
    );
};

export default WeatherWidget;
