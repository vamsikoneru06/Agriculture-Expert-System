"""
ML Routes
==========
POST /api/ml/predict  — Predict crop yield
GET  /api/ml/crops    — List supported crops
"""
from flask import Blueprint
from controllers.ml_controller import predict, supported_crops
from utils.jwt_helper import jwt_required_custom

ml_bp = Blueprint("ml", __name__, url_prefix="/api/ml")


@ml_bp.route("/predict", methods=["POST"])
@jwt_required_custom
def predict_route(current_user):
    """
    ---
    tags: [Machine Learning]
    summary: Predict crop yield using Decision Tree model
    security: [{BearerAuth: []}]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [crop_type, soil_ph, nitrogen, phosphorus, potassium, temperature, rainfall]
            properties:
              crop_type:   {type: string, enum: [wheat, rice, maize, cotton, soybean, potato]}
              soil_ph:     {type: number, minimum: 4.0, maximum: 9.0, example: 6.5}
              nitrogen:    {type: number, minimum: 0, maximum: 300, example: 120}
              phosphorus:  {type: number, minimum: 0, maximum: 200, example: 60}
              potassium:   {type: number, minimum: 0, maximum: 200, example: 80}
              temperature: {type: number, minimum: 0, maximum: 55, example: 25}
              rainfall:    {type: number, minimum: 100, maximum: 3000, example: 700}
              farm_area:   {type: number, minimum: 0.1, example: 1.5, description: hectares}
    responses:
      200:
        description: ML prediction result
        content:
          application/json:
            example:
              success: true
              data:
                yield_per_hectare: 4.32
                total_yield: 6.48
                confidence: 91
                grade: Good
    """
    return predict(current_user)


@ml_bp.route("/crops", methods=["GET"])
@jwt_required_custom
def crops_route(current_user):
    """
    ---
    tags: [Machine Learning]
    summary: Get list of crops the ML model supports
    security: [{BearerAuth: []}]
    """
    return supported_crops(current_user)
