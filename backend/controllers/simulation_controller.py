"""
Simulation Controller
======================
Generates dynamic simulated environmental data.
Returns realistic random values within agronomically valid ranges.
"""
import random
from datetime import datetime, timezone
from utils.response_helper import success_response, error_response


# ── Seasonal parameter ranges ──────────────────────────────────────────────────
SEASON_PROFILES = {
    "kharif": {   # Jun – Oct (hot, rainy monsoon)
        "temp":         (26, 38),
        "humidity":     (65, 95),
        "rainfall":     (20, 60),
        "soil_moisture":(50, 85),
    },
    "rabi": {     # Nov – Mar (cool, dry winter)
        "temp":         (12, 24),
        "humidity":     (40, 70),
        "rainfall":     (0,  20),
        "soil_moisture":(30, 60),
    },
    "zaid": {     # Apr – Jun (hot, dry summer)
        "temp":         (30, 45),
        "humidity":     (20, 55),
        "rainfall":     (0,  10),
        "soil_moisture":(15, 45),
    },
}

SOIL_PROFILES = {
    "sandy": {"water_retention": "low",    "drainage": "excellent", "ph_range": (5.5, 7.0)},
    "clay":  {"water_retention": "high",   "drainage": "poor",      "ph_range": (5.5, 7.5)},
    "loamy": {"water_retention": "medium", "drainage": "good",      "ph_range": (6.0, 7.5)},
    "black": {"water_retention": "high",   "drainage": "moderate",  "ph_range": (6.0, 8.0)},
    "silt":  {"water_retention": "medium", "drainage": "moderate",  "ph_range": (6.0, 7.5)},
}


def run_simulation(current_user: dict):
    """
    GET /api/simulation/run
    Generate one snapshot of simulated environmental conditions.
    Optionally accepts ?season=kharif|rabi|zaid and ?soil=sandy|clay|...
    """
    from flask import request
    season    = request.args.get("season", _detect_current_season())
    soil_type = request.args.get("soil",   "loamy")

    if season not in SEASON_PROFILES:
        season = _detect_current_season()
    if soil_type not in SOIL_PROFILES:
        soil_type = "loamy"

    profile      = SEASON_PROFILES[season]
    soil_profile = SOIL_PROFILES[soil_type]

    # ── Generate random values within agronomic ranges ────────────────────────
    temperature   = round(random.uniform(*profile["temp"]),  1)
    humidity      = round(random.uniform(*profile["humidity"]), 1)
    rainfall      = round(random.uniform(*profile["rainfall"]), 2)
    soil_moisture = round(random.uniform(*profile["soil_moisture"]), 1)
    ph_lo, ph_hi  = soil_profile["ph_range"]
    soil_ph       = round(random.uniform(ph_lo, ph_hi), 2)
    wind_speed    = round(random.uniform(5, 35), 1)       # km/h
    solar_rad     = round(random.uniform(10, 35), 1)      # MJ/m²/day
    evaporation   = round(random.uniform(2, 12), 1)       # mm/day

    # ── Derived recommendation ────────────────────────────────────────────────
    weather_label = _classify_weather(temperature, humidity, rainfall)
    crop_hint     = _suggest_crop(soil_type, weather_label, season)

    return success_response(
        data={
            "timestamp":     datetime.now(timezone.utc).isoformat(),
            "season":        season,
            "soil_type":     soil_type,
            "environmental": {
                "temperature_celsius":   temperature,
                "humidity_percent":      humidity,
                "rainfall_mm":           rainfall,
                "soil_moisture_percent": soil_moisture,
                "soil_ph":               soil_ph,
                "wind_speed_kmh":        wind_speed,
                "solar_radiation":       solar_rad,
                "evaporation_mm":        evaporation,
            },
            "classification": {
                "weather_condition":  weather_label,
                "soil_drainage":      soil_profile["drainage"],
                "water_retention":    soil_profile["water_retention"],
            },
            "recommendation": {
                "suggested_crop":  crop_hint,
                "irrigation_need": _irrigation_advice(soil_moisture, rainfall),
                "alert":           _generate_alert(temperature, humidity, rainfall),
            },
        },
        message="Simulation completed"
    )


# ── Internal helpers ──────────────────────────────────────────────────────────

def _detect_current_season() -> str:
    month = datetime.now().month
    if 6 <= month <= 10: return "kharif"
    if month >= 11 or month <= 3: return "rabi"
    return "zaid"


def _classify_weather(temp: float, humidity: float, rainfall: float) -> str:
    if rainfall > 30:           return "rainy"
    if humidity > 75:           return "humid"
    if temp > 35:               return "hot"
    if humidity < 40 and temp < 30: return "dry"
    return "cool"


def _suggest_crop(soil: str, weather: str, season: str) -> str:
    mapping = {
        ("sandy",  "hot",   "kharif"): "Pearl Millet",
        ("sandy",  "dry",   "rabi"):   "Wheat",
        ("clay",   "humid", "kharif"): "Rice",
        ("clay",   "rainy", "kharif"): "Rice",
        ("loamy",  "hot",   "kharif"): "Cotton",
        ("loamy",  "humid", "rabi"):   "Wheat",
        ("loamy",  "rainy", "kharif"): "Maize",
        ("black",  "hot",   "kharif"): "Soybean",
        ("black",  "rainy", "kharif"): "Cotton",
        ("silt",   "hot",   "kharif"): "Sugarcane",
        ("loamy",  "cool",  "rabi"):   "Potato",
        ("loamy",  "hot",   "zaid"):   "Tomato",
    }
    return mapping.get((soil, weather, season), "Pearl Millet / Jowar")


def _irrigation_advice(soil_moisture: float, rainfall: float) -> str:
    if soil_moisture > 70 or rainfall > 40:
        return "No irrigation needed — adequate moisture"
    elif soil_moisture > 50:
        return "Light irrigation in 5-7 days"
    elif soil_moisture > 30:
        return "Moderate irrigation required within 3-4 days"
    else:
        return "Urgent irrigation needed — critical moisture deficit"


def _generate_alert(temp: float, humidity: float, rainfall: float) -> str | None:
    if temp > 40:
        return "⚠️  Extreme heat alert — protect crops with mulching"
    if rainfall > 50:
        return "⚠️  Heavy rainfall — ensure proper field drainage"
    if humidity > 90:
        return "⚠️  Very high humidity — monitor for fungal diseases"
    if temp < 12:
        return "❄️  Low temperature alert — frost risk for sensitive crops"
    return None
