// https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime

import axios from 'axios';

export function getWeather (lat, lon, timezone) {
    return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime", {params: {
        latitude: lat,
        longitude: lon,
        timezone: timezone
    }}).then(({data}) => {
        return {
            current: parseCurrentData(data),
            daily: parseDailyData(data),
            hourly: parseHourlyData(data)
        }
    })
}

function parseCurrentData ({current_weather, daily}) {

    const { temperature: currentTemp, windspeed: windSpeed, weathercode: iconCode } = current_weather;
    const {
        temperature_2m_max: [highTemp],
        temperature_2m_min: [lowTemp],
        apparent_temperature_max: [highFeelsLike],
        apparent_temperature_min: [lowFeelsLike],
        precipitation_sum: [precip]
    } = daily;

    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(highTemp),
        lowTemp: Math.round(lowTemp),
        highFeelsLike: Math.round(highFeelsLike),
        lowFeelsLike: Math.round(lowFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip * 100) / 100,
        iconCode
    }
}

function parseDailyData ({daily}) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index])
        }
    })
}

function parseHourlyData ({hourly, current_weather}) {
    return hourly.time
    .filter((time) => time >= current_weather.time)
    .map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precipitation: Math.round(hourly.precipitation[index] / 100) / 100,
        }
    });
}