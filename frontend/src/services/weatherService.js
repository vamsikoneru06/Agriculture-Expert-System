/**
 * ═══════════════════════════════════════════════════════════════
 *  WEATHER SERVICE — powered by Open-Meteo
 * ═══════════════════════════════════════════════════════════════
 *
 *  API: https://open-meteo.com
 *  ✅ Completely FREE — no API key, no registration, no limits
 *  ✅ Global coverage including all Indian cities
 *  ✅ Updated hourly from ERA5 / GFS / ECMWF models
 *
 *  HOW TO GET WEATHER API (for students):
 *  ────────────────────────────────────────
 *  1. Open-Meteo  → https://open-meteo.com           (FREE, no key)
 *  2. OpenWeatherMap → https://openweathermap.org    (Free tier, needs key)
 *  3. WeatherAPI  → https://www.weatherapi.com       (Free tier, needs key)
 *  4. IMD (India) → https://mausam.imd.gov.in        (Official Indian govt)
 *
 *  This project uses Open-Meteo (option 1) — just call the URL below.
 * ═══════════════════════════════════════════════════════════════
 */

const BASE = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch live weather for a lat/lng coordinate.
 * Returns data shaped for the Simulation page gauges.
 *
 * @param {number} lat  Latitude
 * @param {number} lng  Longitude
 * @returns {Promise<{temperature:number, humidity:number, rainfall:number, soilMoisture:number, windSpeed:number, weatherCode:number}>}
 */
export async function fetchWeather(lat, lng) {
  const params = new URLSearchParams({
    latitude:  lat,
    longitude: lng,
    current:   'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    hourly:    'soil_moisture_0_to_1cm',
    timezone:  'Asia/Kolkata',
    forecast_days: 1,
  });

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const json = await res.json();

  const c = json.current;

  /* Soil moisture: Open-Meteo gives hourly values in m³/m³ (0–1 range).
     We pick the latest available hour and scale to 0–90 for the gauge. */
  const soilArr = json.hourly?.soil_moisture_0_to_1cm ?? [];
  const soilRaw = soilArr.find(v => v != null) ?? null;
  const soilMoisture = soilRaw != null
    ? Math.round(Math.max(10, Math.min(90, soilRaw * 100)))
    : Math.round(Math.max(10, Math.min(90, (c.relative_humidity_2m ?? 60) * 0.65)));

  /* Rainfall: Open-Meteo gives current-hour precipitation in mm.
     Multiply × 6 to convert "mm this hour" → approximate daily scale
     used by the simulation (0–60 range). */
  const rainfall = Math.round(Math.min(60, (c.precipitation ?? 0) * 6));

  return {
    temperature:  Math.round(c.temperature_2m        ?? 28),
    humidity:     Math.round(c.relative_humidity_2m  ?? 60),
    rainfall,
    soilMoisture,
    windSpeed:    Math.round(c.wind_speed_10m         ??  8),
    weatherCode:  c.weather_code ?? 0,
  };
}

/**
 * Decode WMO weather code → short description + emoji.
 * Reference: https://open-meteo.com/en/docs#weathervariables
 */
export function decodeWeatherCode(code) {
  if (code === 0)              return { desc: 'Clear sky',          emoji: '☀️'  };
  if (code <= 2)               return { desc: 'Partly cloudy',      emoji: '⛅'  };
  if (code === 3)              return { desc: 'Overcast',           emoji: '☁️'  };
  if (code <= 49)              return { desc: 'Fog',                emoji: '🌫️' };
  if (code <= 59)              return { desc: 'Drizzle',            emoji: '🌦️' };
  if (code <= 69)              return { desc: 'Rain',               emoji: '🌧️' };
  if (code <= 79)              return { desc: 'Snow',               emoji: '❄️'  };
  if (code <= 84)              return { desc: 'Rain showers',       emoji: '🌦️' };
  if (code <= 94)              return { desc: 'Thunderstorm',       emoji: '⛈️'  };
  return                              { desc: 'Heavy storm',        emoji: '🌩️' };
}
