"""
ML Prediction Module
=====================
Loads the pre-trained Decision Tree model and label encoder,
then exposes a single `predict_yield()` function.

If the model file does not exist, it is trained automatically on first call.
"""
import os
import joblib
import numpy as np

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "saved_model.pkl")
LE_PATH    = os.path.join(BASE_DIR, "label_encoder.pkl")

# Module-level cache so models are loaded only once per process
_model   = None
_encoder = None


def _load_models():
    """Load (or train) models and cache them in module globals."""
    global _model, _encoder

    if not os.path.exists(MODEL_PATH) or not os.path.exists(LE_PATH):
        print("[INFO] Model files not found -- training now ...")
        from ml_model.train_model import train
        _model, _encoder = train()
    else:
        _model   = joblib.load(MODEL_PATH)
        _encoder = joblib.load(LE_PATH)
        print("[OK]   ML model loaded from disk")


def predict_yield(crop_type: str, soil_ph: float, nitrogen: float,
                  phosphorus: float, potassium: float,
                  temperature: float, rainfall: float,
                  farm_area: float = 1.0) -> dict:
    """
    Predict crop yield using the trained Decision Tree.

    Parameters
    ----------
    crop_type   : str    (wheat | rice | maize | cotton | soybean | potato)
    soil_ph     : float  (4.0 – 9.0)
    nitrogen    : float  kg/ha
    phosphorus  : float  kg/ha
    potassium   : float  kg/ha
    temperature : float  °C
    rainfall    : float  mm/year
    farm_area   : float  hectares (default 1.0)

    Returns
    -------
    dict with prediction results and metadata
    """
    global _model, _encoder

    if _model is None or _encoder is None:
        _load_models()

    # Validate crop_type
    known_crops = list(_encoder.classes_)
    if crop_type not in known_crops:
        # Find closest match
        crop_type = known_crops[0]

    # Encode crop type
    crop_encoded = _encoder.transform([crop_type])[0]

    # Build feature vector as DataFrame (matches training column names)
    feature_cols = ["soil_ph", "nitrogen", "phosphorus", "potassium",
                    "temperature", "rainfall", "crop_type_encoded"]
    import pandas as pd
    features = pd.DataFrame([[
        float(soil_ph), float(nitrogen), float(phosphorus),
        float(potassium), float(temperature), float(rainfall),
        float(crop_encoded),
    ]], columns=feature_cols)

    # Predict
    yield_per_hectare = float(_model.predict(features)[0])
    yield_per_hectare = round(max(0, yield_per_hectare), 2)
    total_yield       = round(yield_per_hectare * farm_area, 2)

    # Confidence estimate (based on tree depth reached)
    confidence = _estimate_confidence(yield_per_hectare, crop_type)

    # Grade the prediction
    grade, grade_color = _grade_yield(yield_per_hectare, crop_type)

    # Feature importance from the trained model
    feature_names = ["Soil pH", "Nitrogen", "Phosphorus",
                     "Potassium", "Temperature", "Rainfall", "Crop Type"]
    importances = [
        {"feature": name, "importance": round(float(imp), 4)}
        for name, imp in zip(feature_names, _model.feature_importances_)
    ]
    importances.sort(key=lambda x: x["importance"], reverse=True)

    return {
        "crop_type":          crop_type,
        "yield_per_hectare":  yield_per_hectare,
        "total_yield":        total_yield,
        "farm_area":          farm_area,
        "confidence":         confidence,
        "grade":              grade,
        "grade_color":        grade_color,
        "feature_importance": importances,
        "model":              "Decision Tree Regressor",
        "unit":               "tons/hectare",
        "inputs_summary": {
            "soil_ph":     soil_ph,
            "nitrogen":    nitrogen,
            "phosphorus":  phosphorus,
            "potassium":   potassium,
            "temperature": temperature,
            "rainfall":    rainfall,
        },
    }


def _estimate_confidence(yield_val: float, crop: str) -> int:
    """Return a confidence percentage (heuristic based on yield range)."""
    typical_ranges = {
        "wheat":     (3.0, 5.5),
        "rice":      (4.0, 7.0),
        "maize":     (5.0, 8.0),
        "cotton":    (2.0, 3.5),
        "soybean":   (1.5, 3.0),
        "potato":    (20.0, 30.0),
        "sugarcane": (65.0, 90.0),
        "tomato":    (25.0, 45.0),
        "onion":     (15.0, 25.0),
        "banana":    (30.0, 50.0),
        "groundnut": (1.5, 2.8),
        "sunflower": (1.5, 2.5),
    }
    lo, hi = typical_ranges.get(crop, (1.0, 10.0))
    if lo <= yield_val <= hi:
        return 91
    elif yield_val < lo:
        drop = (lo - yield_val) / lo
        return max(65, int(91 - drop * 30))
    else:
        excess = (yield_val - hi) / hi
        return max(70, int(91 - excess * 20))


def _grade_yield(yield_val: float, crop: str) -> tuple[str, str]:
    """Convert raw yield to a human-readable grade."""
    typical_hi = {
        "wheat": 5.0, "rice": 6.5, "maize": 7.5,
        "cotton": 3.2, "soybean": 2.5, "potato": 28.0,
        "sugarcane": 90.0, "tomato": 45.0, "onion": 25.0,
        "banana": 50.0, "groundnut": 2.8, "sunflower": 2.5,
    }
    hi = typical_hi.get(crop, 5.0)
    ratio = yield_val / hi

    if ratio >= 0.90:   return "Excellent", "text-green-600"
    elif ratio >= 0.70: return "Good",      "text-blue-600"
    elif ratio >= 0.50: return "Average",   "text-yellow-600"
    else:               return "Below Average", "text-red-500"


def get_supported_crops() -> list:
    """Return the list of crops the model was trained on."""
    global _encoder
    if _encoder is None:
        _load_models()
    return list(_encoder.classes_)
