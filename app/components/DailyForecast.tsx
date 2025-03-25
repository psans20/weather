import { WiDaySunny, WiNightClear, WiCloudy, WiRain } from "react-icons/wi";

interface DailyForecastProps {
  daily: Array<{
    day: string;
    temp: number;
    icon: string;
  }>;
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case '01d':
        return <WiDaySunny className="text-2xl sm:text-3xl" />;
      case '01n':
        return <WiNightClear className="text-2xl sm:text-3xl" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <WiCloudy className="text-2xl sm:text-3xl" />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <WiRain className="text-2xl sm:text-3xl" />;
      default:
        return <WiDaySunny className="text-2xl sm:text-3xl" />;
    }
  };

  return (
    <div className="mt-2 sm:mt-4">
      <div className="flex overflow-x-auto pb-4 gap-3 sm:gap-4 no-scrollbar sm:grid sm:grid-cols-7">
        {daily.map((day, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-[80px] sm:w-auto bg-black/20 rounded-lg p-3 sm:p-4 backdrop-blur-sm text-center"
          >
            <h3 className="text-gray-300 mb-2 text-sm sm:text-base">
              {new Date(day.day).toLocaleDateString('en-US', {
                weekday: 'short',
              })}
            </h3>
            <div className="flex justify-center items-center h-10 sm:h-12">
              {getWeatherIcon(day.icon)}
            </div>
            <p className="text-base sm:text-lg font-semibold mt-2">{Math.round(day.temp)}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
} 