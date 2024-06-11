const API_KEY = "d6987fdc89145b5414819e74fec862da";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType);
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

    return fetch(url).then((res) => res.json());
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
        timeZone: 'UTC' // Ensure the correct handling of time zone
    }).format(localTime);
};

const formatToTimeOnly = (secs, timezoneOffset) => {
    const localTime = new Date((secs + timezoneOffset) * 1000);
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // Ensure the correct handling of time zone
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

    // Convert temperatures from Kelvin to Celsius
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
    };
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        "weather",
        searchParams
    ).then(formatCurrent);
    
    return { ...formattedCurrentWeather };
};

export default getFormattedWeatherData;
