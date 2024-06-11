// components/Forecast.jsx
import React from 'react';

export const Forecast = ({ title, items }) => {
  return (
    <div className="w-72 md:w-[900px]">
      <div className='flex items-center justify-start mt-6'>
        <p className='font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-1' />
      <div className='flex items-center justify-evenly w-full'>
        {items.map((item, index) => (
          <div key={index} className='flex flex-col items-center justify-center'>
            <p className='font-light text-sm'>{item.time || item.day}</p>
            <img src={item.icon} alt="weather icon" className='w-12 my-1' />
            <p className='font-medium'>{Math.round(item.temp)}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
