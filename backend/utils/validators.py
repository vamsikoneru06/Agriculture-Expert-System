"""
Input validation utilities.
Returns a list of error strings; empty list means input is valid.
"""
import re


def validate_registration(data: dict) -> list[str]:
    errors = []

    name = data.get("name", "").strip()
    if not name or len(name) < 2:
        errors.append("Name must be at least 2 characters")
    if len(name) > 100:
        errors.append("Name cannot exceed 100 characters")

    email = data.get("email", "").strip()
    if not email:
        errors.append("Email is required")
    elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        errors.append("Invalid email format")

    password = data.get("password", "")
    if not password:
        errors.append("Password is required")
    elif len(password) < 6:
        errors.append("Password must be at least 6 characters")

    role = data.get("role", "farmer")
    if role not in {"admin", "farmer", "student"}:
        errors.append("Role must be 'admin', 'farmer', or 'student'")

    return errors


def validate_login(data: dict) -> list[str]:
    errors = []
    if not data.get("email", "").strip():
        errors.append("Email is required")
    if not data.get("password", ""):
        errors.append("Password is required")
    return errors


def validate_expert_input(data: dict) -> list[str]:
    errors = []
    valid_soils   = {"sandy", "clay", "loamy", "black", "silt"}
    valid_weather = {"hot", "humid", "rainy", "dry", "cool"}
    valid_seasons = {"kharif", "rabi", "zaid"}

    soil = data.get("soilType", "")
    if soil not in valid_soils:
        errors.append(f"soilType must be one of {sorted(valid_soils)}")

    weather = data.get("weather", "")
    if weather not in valid_weather:
        errors.append(f"weather must be one of {sorted(valid_weather)}")

    season = data.get("season", "")
    if season not in valid_seasons:
        errors.append(f"season must be one of {sorted(valid_seasons)}")

    return errors


def validate_ml_input(data: dict) -> list[str]:
    errors = []
    valid_crops = {"wheat", "rice", "maize", "cotton", "soybean", "potato"}

    crop = data.get("crop_type", "")
    if crop not in valid_crops:
        errors.append(f"crop_type must be one of {sorted(valid_crops)}")

    numeric_fields = {
        "soil_ph":     (4.0, 9.0),
        "nitrogen":    (0,   300),
        "phosphorus":  (0,   200),
        "potassium":   (0,   200),
        "temperature": (0,   55),
        "rainfall":    (100, 3000),
    }
    for field, (lo, hi) in numeric_fields.items():
        val = data.get(field)
        if val is None:
            errors.append(f"{field} is required")
        else:
            try:
                v = float(val)
                if not (lo <= v <= hi):
                    errors.append(f"{field} must be between {lo} and {hi}")
            except (TypeError, ValueError):
                errors.append(f"{field} must be a number")

    return errors


def validate_rule(data: dict) -> list[str]:
    errors = []
    cond = data.get("conditions", {})
    out  = data.get("output", {})

    if not isinstance(cond, dict):
        errors.append("'conditions' must be an object")
    else:
        for key in ("soilType", "weather", "season"):
            if not cond.get(key):
                errors.append(f"conditions.{key} is required")

    if not isinstance(out, dict):
        errors.append("'output' must be an object")
    else:
        for key in ("crop", "fertilizer", "pestControl"):
            if not out.get(key):
                errors.append(f"output.{key} is required")

    return errors
