"use client";
import { useState, useEffect } from "react";
import Search from './components/Search';
import TodayForecast from './components/TodayForecast';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { MdLocationOn, MdSearch } from "react-icons/md";
import { WiHumidity } from "react-icons/wi";
import { FaEye, FaTemperatureHigh } from "react-icons/fa";
import { WiDaySunny } from "react-icons/wi";
import getFormattedWeatherData from './utils/weather';
import { getCityImage } from './utils/unsplash';

interface WeatherData {
  hourly: {
    time: string;
    temp: number;
    icon: string;
  }[];
  daily: {
    day: string;
    temp: number;
    icon: string;
  }[];
  lat: number;
  lon: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  name: string;
  country: string;
  sunrise: string;
  sunset: string;
  speed: number;
  details: string;
  icon: string;
  formattedLocalTime: string;
  timezone: number;
  uv_index?: number;
  dew_point?: number;
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState("London");
  const [activeTab, setActiveTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  // Function to get local time for a specific timezone offset
  const getLocalTime = (timezoneOffset: number) => {
    const localTime = new Date();
    const utc = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    return new Date(utc + (1000 * timezoneOffset));
  };

  // Function to format time with AM/PM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to get background image based on location and weather
  const getBackgroundImage = async (weather: string, location: string) => {
    try {
        const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
        
        if (!unsplashKey) {
            console.error('Unsplash API key is not configured');
            return null;
        }

        // Try multiple search strategies
        const searchQueries = [
            // First try exact location with landmarks
            `${location} landmarks famous`,
            // Then try with capital city if it's a country
            `${location} capital city skyline`,
            // Then try with scenic views
            `${location} scenic landscape`,
            // Finally try with cityscape/landscape
            `${location} cityscape architecture`
        ];

        for (const query of searchQueries) {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=20`,
                {
                    headers: {
                        Authorization: `Client-ID ${unsplashKey}`,
                    },
                }
            );

            if (!response.ok) {
                console.error(`Unsplash API error: ${response.status} - ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Try to find images that explicitly mention the location
                const locationName = location.toLowerCase();
                const relevantImages = data.results.filter((img: { 
                    description?: string; 
                    alt_description?: string; 
                    tags?: Array<{ title: string }>;
                    urls: { regular: string } 
                }) => {
                    const description = img.description?.toLowerCase() || '';
                    const altDescription = img.alt_description?.toLowerCase() || '';
                    const tags = img.tags?.map(tag => tag.title.toLowerCase()) || [];
                    
                    return description.includes(locationName) ||
                           altDescription.includes(locationName) ||
                           tags.some(tag => tag.includes(locationName));
                });

                // If we found relevant images, use the first one
                if (relevantImages.length > 0) {
                    return relevantImages[0].urls.regular;
                }

                // If no relevant images found, use the first result from this query
                return data.results[0].urls.regular;
            }
        }
        
        // If no results found from location queries, try weather-based fallback
        const weatherTerms: { [key: string]: string } = {
            Clear: `${location} sunny day`,
            Clouds: `${location} cloudy weather`,
            Rain: `${location} rainy weather`,
            Drizzle: `${location} rainy weather`,
            Thunderstorm: `${location} storm weather`,
            Snow: `${location} snow weather`,
            Mist: `${location} misty weather`,
            Smoke: `${location} foggy weather`,
            Haze: `${location} hazy weather`,
            Dust: `${location} dusty weather`,
            Fog: `${location} foggy weather`,
            Sand: `${location} desert weather`,
            Ash: `${location} weather`,
            Squall: `${location} stormy weather`,
            Tornado: `${location} severe weather`
        };

        const fallbackResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(weatherTerms[weather] || `${location} weather`)}&orientation=landscape&per_page=1`,
            {
                headers: {
                    Authorization: `Client-ID ${unsplashKey}`,
                },
            }
        );

        if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.results && fallbackData.results.length > 0) {
                return fallbackData.results[0].urls.regular;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching background image:', error);
        return null;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormattedWeatherData({ q: city });
        setWeatherData(data);
        
        // Fetch the background image for the city
        const imageUrl = await getBackgroundImage(data.details.split(" ")[0], data.name);
        setBackgroundImage(imageUrl);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCity(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const renderForecast = () => {
    switch (activeTab) {
      case "today":
        return <TodayForecast temp={weatherData!.temp} />;
      case "hourly":
        return <HourlyForecast hourly={weatherData!.hourly} />;
      case "daily":
        return <DailyForecast daily={weatherData!.daily} />;
      default:
        return <TodayForecast temp={weatherData!.temp} />;
    }
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const timeZones = ["EST", "GMT", "IST", "PDT", "JST"];
  const localTime = getLocalTime(weatherData.timezone);

  return (
    <main className="h-screen relative overflow-hidden">
      {/* Background Image with Preload */}
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              filter: "brightness(0.7)"
            }}
          />
          <div 
            className="absolute inset-0 bg-black bg-opacity-30"
            aria-hidden="true"
          />
        </>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 h-full text-white p-4 sm:p-8 flex flex-col">
        {/* Search Bar - Mobile: Top Center, Desktop: Top Right */}
        <form 
          onSubmit={handleSearch}
          className="w-full sm:w-auto sm:absolute sm:right-8 sm:top-8 flex justify-center sm:justify-end mb-8 sm:mb-0"
        >
          <div className="relative w-full sm:w-auto max-w-[300px] sm:top-40">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a country/city..."
              className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 px-4 py-2 pr-10 rounded-full border border-white/20 focus:outline-none focus:border-white/40 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            >
              <MdSearch size={20} />
            </button>
          </div>
        </form>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left">
            {/* Left Side - Temperature and Location */}
            <div className="space-y-4 w-full sm:w-auto mb-6 sm:mb-0">
              <div className="flex items-end justify-center sm:justify-start">
                <span className="text-6xl sm:text-8xl font-light">{Math.round(weatherData.temp)}</span>
                <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 ml-2">°C</span>
                <span className="text-xl sm:text-2xl mb-3 sm:mb-4 ml-4 text-gray-300">F</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <WiDaySunny className="text-2xl" />
                <span className="text-lg sm:text-xl">{weatherData.details}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl">{weatherData.name}</h2>
                <p className="text-gray-300">{weatherData.country}</p>
              </div>
            </div>

            {/* Right Side - Time and Date */}
            <div className="text-center sm:text-right mb-6 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl">{formatTime(localTime)}</h2>
              <p className="text-gray-300">
                {formatDate(localTime)}
              </p>
              <div className="flex space-x-4 mt-2 justify-center sm:justify-end overflow-x-auto">
                {timeZones.map((zone) => (
                  <span key={zone} className="text-gray-300 text-sm cursor-pointer hover:text-white whitespace-nowrap">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="w-full bg-black/40 backdrop-blur-sm rounded-t-xl p-4 sm:p-8">
            {/* Tabs */}
            <div className="flex space-x-4 sm:space-x-8 mb-6 overflow-x-auto pb-2 justify-between sm:justify-start">
              {[
                { id: 'today', label: "Today's Forecast" },
                { id: 'hourly', label: "Hourly Forecast" },
                { id: 'daily', label: "Daily Forecast" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`text-base sm:text-lg whitespace-nowrap flex-1 sm:flex-none px-2 py-1 ${
                    activeTab === tab.id
                      ? 'text-white border-b-2'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6">
              <div className="flex items-center space-x-3 bg-black/20 rounded-lg p-3">
                <WiHumidity className="text-2xl" />
                <div>
                  <p className="text-gray-300 text-sm">Humidity</p>
                  <p className="text-base sm:text-lg">{weatherData.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 rounded-lg p-3">
                <FaEye className="text-2xl" />
                <div>
                  <p className="text-gray-300 text-sm">Visibility</p>
                  <p className="text-base sm:text-lg">Unlimited</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 rounded-lg p-3">
                <FaTemperatureHigh className="text-2xl" />
                <div>
                  <p className="text-gray-300 text-sm">UV Index</p>
                  <p className="text-base sm:text-lg">{weatherData.uv_index || '0'} of 10</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-black/20 rounded-lg p-3">
                <WiDaySunny className="text-2xl" />
                <div>
                  <p className="text-gray-300 text-sm">Dew Point</p>
                  <p className="text-base sm:text-lg">{Math.round(weatherData.dew_point || 16)}°</p>
                </div>
              </div>
            </div>

            {/* Dynamic Forecast Section */}
            {renderForecast()}

            {/* Credit Line */}
            <div className="mt-4 text-center text-xs text-gray-400">
              <p>
                Developed by{' '}
                <a 
                  href="https://umarhussain.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  Umar Hussain
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
