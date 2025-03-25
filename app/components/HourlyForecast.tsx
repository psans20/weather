import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiDayCloudyHigh, WiNightAltCloudyHigh, WiThunderstorm, WiSnow, WiDust } from "react-icons/wi";

interface HourlyForecastProps {
  hourly: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  const getWeatherIcon = (icon: string) => {
    // Map OpenWeatherMap icon codes to Weather Icons
    switch (icon) {
      case '01d': return <WiDaySunny className="text-3xl sm:text-4xl" />; // clear sky day
      case '01n': return <WiNightClear className="text-3xl sm:text-4xl" />; // clear sky night
      case '02d': return <WiDayCloudyHigh className="text-3xl sm:text-4xl" />; // few clouds day
      case '02n': return <WiNightAltCloudyHigh className="text-3xl sm:text-4xl" />; // few clouds night
      case '03d':
      case '03n':
      case '04d':
      case '04n': return <WiCloudy className="text-3xl sm:text-4xl" />; // scattered/broken clouds
      case '09d':
      case '09n':
      case '10d':
      case '10n': return <WiRain className="text-3xl sm:text-4xl" />; // rain
      case '11d':
      case '11n': return <WiThunderstorm className="text-3xl sm:text-4xl" />; // thunderstorm
      case '13d':
      case '13n': return <WiSnow className="text-3xl sm:text-4xl" />; // snow
      case '50d':
      case '50n': return <WiDust className="text-3xl sm:text-4xl" />; // mist
      default: return <WiDaySunny className="text-3xl sm:text-4xl" />;
    }
  };

  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex sm:flex-wrap overflow-x-auto sm:overflow-x-hidden pb-4 gap-3 sm:gap-4 no-scrollbar justify-start sm:justify-center">
        {hourly.map((hour, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-[80px] sm:w-[100px] bg-black/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm text-center"
          >
            <h3 className="text-gray-300 mb-2 text-sm sm:text-base font-medium">{hour.time}</h3>
            <div className="flex justify-center items-center h-10 sm:h-12">
              {getWeatherIcon(hour.icon)}
            </div>
            <p className="text-base sm:text-lg font-semibold mt-2">{Math.round(hour.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
} 