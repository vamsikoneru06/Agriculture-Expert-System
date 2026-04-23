"""
ML Controller
==============
Exposes the trained Decision Tree model via REST endpoints.
"""
from flask import request
from ml_model.predict import predict_yield, get_supported_crops
from models.prediction_model import save_prediction
from utils.validators import validate_ml_input
from utils.response_helper import success_response, error_response


def predict(current_user: dict):
    """
    POST /api/ml/predict
    Predict crop yield using the trained Decision Tree model.

    Request JSON:
    {
        "crop_type":   "wheat",
        "soil_ph":     6.5,
        "nitrogen":    120,
        "phosphorus":  60,
        "potassium":   80,
        "temperature": 25,
        "rainfall":    700,
        "farm_area":   1.5    (optional, default=1.0)
    }
    """
    data = request.get_json(silent=True) or {}

    # ── Validate input ────────────────────────────────────────────────────────
    errors = validate_ml_input(data)
    if errors:
        return error_response("Invalid ML input parameters", 422, errors)

    try:
        result = predict_yield(
            crop_type   = data["crop_type"],
            soil_ph     = float(data["soil_ph"]),
            nitrogen    = float(data["nitrogen"]),
            phosphorus  = float(data["phosphorus"]),
            potassium   = float(data["potassium"]),
            temperature = float(data["temperature"]),
            rainfall    = float(data["rainfall"]),
            farm_area   = float(data.get("farm_area", 1.0)),
        )

        # ── Store result in prediction history ────────────────────────────────
        save_prediction(
            user_id         = current_user["_id"],
            prediction_type = "ml",
            inputs          = {k: v for k, v in data.items()},
            output          = {
                "yield_per_hectare": result["yield_per_hectare"],
                "total_yield":       result["total_yield"],
                "grade":             result["grade"],
                "confidence":        result["confidence"],
            },
        )

        return success_response(
            data=result,
            message="ML prediction completed successfully"
        )

    except Exception as e:
        return error_response(f"ML prediction error: {str(e)}", 500)


def supported_crops(current_user: dict):
    """GET /api/ml/crops — List all crops the model was trained on."""
    try:
        crops = get_supported_crops()
        return success_response(
            data={"crops": crops},
            message="Supported crops fetched"
        )
    except Exception as e:
        return error_response(f"Error fetching crops: {str(e)}", 500)
