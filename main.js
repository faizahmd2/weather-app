import { ICON_MAP } from './iconMap';
import './style.css';
import { getWeather } from './weather';

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({coords}) {
    getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather)
    .catch(e => {
        console.error(e);
        alert("Error getting Weather.")
    });
}

function positionError() {
    alert("There was error getting your location. Please allow us to use our location and refresh the page.")
}

function renderWeather({current, daily, hourly}) {
    renderCurrentWeather(current);
    renderDailyWeather(daily);
    renderHourlyWeather(hourly);
    document.body.classList.remove("blurred");
}

function setValue(selector, value, {parent = document} = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current) {
    currentIcon.src = getIconUrl(current.iconCode);
    setValue("current-temp",current.currentTemp);
    setValue("current-high",current.highTemp);
    setValue("current-low",current.lowTemp);
    setValue("current-fl-high",current.highFeelsLike);
    setValue("current-fl-low",current.lowFeelsLike);
    setValue("current-wind",current.windSpeed);
    setValue("current-precip",current.precip);
}

const DAY_FORMATTER = Intl.DateTimeFormat(undefined, {weekday: 'long'});
const daySection = document.querySelector("[data-day-section]");
const dailyCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
    daySection.innerHTML = "";
    daily.forEach((day) => {
        const element = dailyCardTemplate.content.cloneNode(true);
        setValue("temp", day.maxTemp, {parent: element})
        setValue("day", DAY_FORMATTER.format(day.timestamp), {parent: element})
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        daySection.append(element)
    })
}

const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, {hour: 'numeric'});
const hourSection = document.querySelector("[data-hour-section]");
const hourlyRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
    hourSection.innerHTML = "";
    hourly.forEach((hour) => {
        const element = hourlyRowTemplate.content.cloneNode(true);
        setValue("temp", hour.temp, {parent: element})
        setValue("fl-temp", hour.feelsLike, {parent: element})
        setValue("wind", hour.windSpeed, {parent: element})
        setValue("precip", hour.precipitation, {parent: element})
        setValue("day", DAY_FORMATTER.format(hour.timestamp), {parent: element})
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), {parent: element})
        element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
        hourSection.append(element)
    })
}
