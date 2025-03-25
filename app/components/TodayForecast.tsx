interface TodayForecastProps {
  temp: number;
}

export default function TodayForecast({ temp }: TodayForecastProps) {
  const periods = [
    { name: 'Morning', temp: Math.round(temp - 2) },
    { name: 'Afternoon', temp: Math.round(temp + 2) },
    { name: 'Evening', temp: Math.round(temp - 4) },
  ];

  return (
    <div className="mt-8 flex justify-between">
      {periods.map(({ name, temp }) => (
        <div key={name} className="text-center">
          <h3 className="text-gray-300 mb-2">{name}</h3>
          <p className="text-2xl">{temp}°C</p>
        </div>
      ))}
    </div>
  );
} 