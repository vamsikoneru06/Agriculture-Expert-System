"""
Simulation Routes
==================
GET /api/simulation/run?season=kharif&soil=loamy
"""
from flask import Blueprint
from controllers.simulation_controller import run_simulation
from utils.jwt_helper import jwt_required_custom

simulation_bp = Blueprint("simulation", __name__, url_prefix="/api/simulation")


@simulation_bp.route("/run", methods=["GET"])
@jwt_required_custom
def simulate_route(current_user):
    """
    ---
    tags: [Simulation]
    summary: Generate simulated environmental conditions
    security: [{BearerAuth: []}]
    parameters:
      - in: query
        name: season
        schema:
          type: string
          enum: [kharif, rabi, zaid]
        description: Cropping season (auto-detected from current month if omitted)
      - in: query
        name: soil
        schema:
          type: string
          enum: [sandy, clay, loamy, black, silt]
        description: Soil type (default loamy)
    responses:
      200:
        description: Simulated environmental data snapshot
        content:
          application/json:
            example:
              success: true
              data:
                temperature_celsius: 28.4
                humidity_percent: 67.2
                rainfall_mm: 12.5
                soil_moisture_percent: 55.3
                suggested_crop: Cotton
    """
    return run_simulation(current_user)
