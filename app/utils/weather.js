const API_KEY = "d6987fdc89145b5414819e74fec862da";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const iconURLFromCode = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalTime = (secs, timezoneOffset, format = "cccc, dd LLL yyyy | Local time: hh:mm a") => {
    const localTime = new Date((secs + timezoneOffset) * 1000);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' 
    }).format(localTime);
};

const formatToTimeOnly = (secs, timezoneOffset) => {
    const localTime = new Date((secs + timezoneOffset) * 1000);
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' 
    }).format(localTime);
};

const formatCurrent = (data) => {
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        visibility,
        timezone,
    } = data;

    const { main: details, icon } = weather[0];
    const formattedLocalTime = formatToLocalTime(dt, timezone);


    const tempCelsius = temp - 273.15;
    const feelsLikeCelsius = feels_like - 273.15;
    const tempMinCelsius = temp_min - 273.15;
    const tempMaxCelsius = temp_max - 273.15;

    return {
        lat,
        lon,
        temp: tempCelsius,
        feels_like: feelsLikeCelsius,
        temp_min: tempMinCelsius,
        temp_max: tempMaxCelsius,
        humidity,
        pressure,
        visibility,
        name,
        country,
        sunrise: formatToTimeOnly(sunrise, timezone),
        sunset: formatToTimeOnly(sunset, timezone),
        speed,
        details,
        icon: iconURLFromCode(icon),
        formattedLocalTime,
        timezone,
    };
};

const formatHourlyForecast = (data, timezone) => {
    if (!data || !data.slice) {
        console.error("Hourly forecast data is not in expected format:", data);
        return [];
    }

    // Take only the next 8 3-hour intervals (24 hours)
    return data.slice(0, 8).map(item => {
        const { dt, main: { temp }, weather } = item;
        const { icon } = weather[0];
        
        // Create a date object using the timestamp and add timezone offset
        const date = new Date(dt * 1000);
        date.setSeconds(date.getSeconds() + timezone);
        
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: true,
            timeZone: 'UTC'
        }).format(date);

        return {
            time: formattedTime,
            temp: temp - 273.15,
            icon: icon
        };
    });
};

const formatDailyForecast = (data, timezoneOffset) => {
    if (!data || !data.slice) {
        console.error("Daily forecast data is not in expected format:", data);
        return [];
    }
    return data.slice(0, 5).map(item => {
        const { dt, temp: { day }, weather } = item;
        const { icon } = weather[0];
        return {
            day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date((dt + timezoneOffset) * 1000)),
            temp: day - 273.15, 
            icon: iconURLFromCode(icon),
        };
    });
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        "weather",
        searchParams.q ? { q: searchParams.q } : { lat: searchParams.lat, lon: searchParams.lon }
    ).then(formatCurrent);

    const { lat, lon, timezone } = formattedCurrentWeather;

    const hourlyForecastData = await getWeatherData(
        "forecast",
        { lat, lon, ...searchParams }
    );
    const formattedHourlyForecast = formatHourlyForecast(hourlyForecastData.list, timezone);

    const dailyForecastData = await getWeatherData(
        "onecall",
        { lat, lon, exclude: "current,minutely,hourly,alerts", appid: API_KEY }
    );
    const formattedDailyForecast = formatDailyForecast(dailyForecastData.daily, timezone);

    return { ...formattedCurrentWeather, hourly: formattedHourlyForecast, daily: formattedDailyForecast };
};

export default getFormattedWeatherData;
