"use client";
import { useState, useEffect } from "react";
import Search from './components/Search';
import Thermometer from './components/Thermometer';
import Horizon from './components/Horizon';
import Forecast from './components/Forecast';
import { GiSunset, GiSunrise } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdWaterDrop } from "react-icons/md";
import { PiWind } from "react-icons/pi";
import { FaThermometerEmpty } from "react-icons/fa";
import getFormattedWeatherData from './utils/weather';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("London");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    getFormattedWeatherData({ q: city }).then(data => setWeatherData(data));
  }, [city]);

  const handleSearch = (query) => {
    setCity(query);
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700 p-4 space-y-8 h-screen">
      <Search onSearch={handleSearch} />
      <h2 id="date" className="text-center font-extralight text-xl text-gray-200">
        {weatherData.formattedLocalTime}
      </h2>
      <h2 className="text-center text-2xl">{weatherData.name}, {weatherData.country}</h2>
      <h2 className="text-cyan-200 text-center">{weatherData.details}</h2>

      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center justify-around w-full py-3 space-x-8 lg:space-x-0 md:px-24 lg:px-48 xl:px-72">
          <img src={weatherData.icon} className="w-20" alt="Weather Icon" />
          <h2 className="text-4xl text-center">{Math.round(weatherData.temp)}°</h2>

          <div className="flex flex-col space-y-3">
            <Thermometer icon={FaThermometerEmpty} property="Real Feel" calculation={`${Math.round(weatherData.feels_like)}°`} />
            <Thermometer icon={MdWaterDrop} property="Humidity" calculation={`${weatherData.humidity}%`} />
            <Thermometer icon={PiWind} property="Wind" calculation={`${weatherData.speed} km/h`} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row md:justify-around md:gap-x-10 md:my-12 my-10 gap-10">
          <Horizon icon={GiSunrise} label="Sunrise" time={weatherData.sunrise} />
          <Horizon icon={GiSunset} label="Sunset" time={weatherData.sunset} />
          <Horizon icon={MdKeyboardArrowUp} label="High" time={`${Math.round(weatherData.temp_max)}°`} />
          <Horizon icon={MdKeyboardArrowDown} label="Low" time={`${Math.round(weatherData.temp_min)}°`} />
        </div>
        <Forecast />
      </div>
    </main>
  );
}
