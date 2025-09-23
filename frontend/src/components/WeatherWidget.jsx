import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faSun, faCloudRain, faTint, faEye, faWind } from "@fortawesome/free-solid-svg-icons";

// Mock weather data - in real app would come from weather API
const weatherData = {
  location: "Springfield Valley Farm",
  current: {
    temperature: 22,
    condition: "cloudy",
    humidity: 65,
    rainChance: 40,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6
  },
  forecast: [
    { day: "Today", high: 25, low: 18, condition: "cloudy", rainChance: 40 },
    { day: "Tomorrow", high: 23, low: 16, condition: "rainy", rainChance: 85 },
    { day: "Wednesday", high: 27, low: 20, condition: "sunny", rainChance: 10 },
    { day: "Thursday", high: 26, low: 19, condition: "sunny", rainChance: 15 }
  ]
};

const getWeatherIcon = (condition, size = "w-6 h-6") => {
  switch (condition) {
    case "sunny":
      return <FontAwesomeIcon icon={faSun} className={`${size} text-yellow-500`} />;
    case "cloudy":
      return <FontAwesomeIcon icon={faCloud} className={`${size} text-gray-500`} />;
    case "rainy":
      return <FontAwesomeIcon icon={faCloudRain} className={`${size} text-blue-500`} />;
    case "overcast":
      return <FontAwesomeIcon icon={faCloud} className={`${size} text-gray-500`} />;
    default:
      return <FontAwesomeIcon icon={faCloud} className={`${size} text-gray-500`} />;
  }
};

const getRainChanceColor = (chance) => {
  if (chance >= 70) return "text-blue-600 font-semibold";
  if (chance >= 40) return "text-yellow-600 font-medium";
  return "text-gray-500";
};

const getUVIndexColor = (index) => {
  if (index >= 8) return "bg-red-100 text-red-700 border-red-200";
  if (index >= 6) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  if (index >= 3) return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export default function WeatherWidget() {
  return (
    <Card className="w-full max-w-md mx-auto lg:max-w-lg bg-white h-[620px] flex flex-col">
      <CardHeader className="text-center pb-4 px-4 sm:px-6 flex-shrink-0">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {getWeatherIcon(weatherData.current.condition)}
        </div>
        <CardTitle className="text-lg sm:text-xl">Weather Update</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {weatherData.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 flex-1">
        {/* Current Weather */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            {getWeatherIcon(weatherData.current.condition, "w-6 h-6 sm:w-8 sm:h-8")}
            <span className="text-2xl sm:text-3xl font-bold">{weatherData.current.temperature}°C</span>
          </div>
          <p className="text-gray-600 capitalize text-sm">
            {weatherData.current.condition}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FontAwesomeIcon icon={faCloudRain} className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-xs text-gray-600">Rain Chance</span>
            </div>
            <p className={`text-base sm:text-lg font-semibold ${getRainChanceColor(weatherData.current.rainChance)}`}>
              {weatherData.current.rainChance}%
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FontAwesomeIcon icon={faTint} className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-xs text-gray-600">Humidity</span>
            </div>
            <p className="text-base sm:text-lg font-semibold">{weatherData.current.humidity}%</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mb-1">
              <FontAwesomeIcon icon={faWind} className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Wind</span>
            </div>
            <p className="text-sm font-medium">{weatherData.current.windSpeed} km/h</p>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mb-1">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Visibility</span>
            </div>
            <p className="text-sm font-medium">{weatherData.current.visibility} km</p>
          </div>

          <div className="text-center">
            <div className="mb-1">
              <span className="text-xs text-gray-600 block sm:hidden">UV Index</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getUVIndexColor(weatherData.current.uvIndex)}`}>
              UV {weatherData.current.uvIndex}
            </Badge>
          </div>
        </div>

        {/* Forecast */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-600">4-Day Forecast</h4>
          <div className="space-y-2">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-1 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {getWeatherIcon(day.condition, "w-4 h-4")}
                  <span className="text-sm font-medium truncate">{day.day}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-sm">
                  <span className={`${getRainChanceColor(day.rainChance)} text-xs sm:text-sm`}>
                    {day.rainChance}%
                  </span>
                  <span className="text-gray-600 text-xs sm:text-sm font-medium">
                    {day.high}°/{day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alert */}
        {weatherData.current.rainChance > 70 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faCloudRain} className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="font-semibold text-sm text-red-700">Weather Alert</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              High chance of rain tomorrow. Consider postponing outdoor work and check field drainage.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
