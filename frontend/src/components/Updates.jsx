import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faTasks, faMapMarkerAlt, faThermometerHalf, faSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";

const Updates = () => {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Loading...");

  const latitude = 12.9716; // Example latitude
  const longitude = 77.5946; // Example longitude

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather data
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        setWeather({
          temperature: weatherData.current_weather.temperature,
          condition: mapWeatherCode(weatherData.current_weather.weathercode),
        });

        // Fetch location data
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoRes.json();
        const address = geoData.address || {};

        // Get the nearest recognizable location
        const nearestLocation =
          address.village ||
          address.hamlet ||
          address.town ||
          address.municipality ||
          address.city ||
          address.county ||
          address.state ||
          "Unknown";

        setLocationName(nearestLocation);
      } catch (error) {
        console.error("Error fetching weather/location:", error);
        setLocationName("Unavailable");
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Quick Updates</h2>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Weather Card */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <FontAwesomeIcon icon={getWeatherIcon(weather?.condition)} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 text-xs" />
                <span className="text-xs font-medium text-gray-600 truncate">{locationName}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {weather ? weather.condition : "Loading..."}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faThermometerHalf} className="text-blue-500 text-xs" />
                    <span className="text-lg font-bold text-gray-800">
                      {weather ? `${weather.temperature}°C` : "--"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {weather ? `Feels ${Math.round(weather.temperature + 2)}°C` : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover:border-green-200 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <FontAwesomeIcon icon={faTasks} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700">Daily Tasks</p>
                  <p className="text-xs text-gray-600">3 pending today</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "60%" }}></div>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">60%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapWeatherCode(code) {
  const mapping = {
    0: "Sunny",
    1: "Sunny",
    2: "Cloudy",
    3: "Overcast",
    45: "Cloudy",
    48: "Cloudy",
    51: "Rainy",
    53: "Rainy",
    55: "Rainy",
    61: "Rainy",
    63: "Rainy",
    65: "Rainy",
    80: "Rainy",
    81: "Rainy",
    82: "Rainy",
  };
  return mapping[code] || "Cloudy";
}

function getWeatherIcon(condition) {
  switch (condition) {
    case "Sunny":
      return faSun;
    case "Rainy":
      return faCloudRain;
    default:
      return faCloud;
  }
}

export default Updates;
