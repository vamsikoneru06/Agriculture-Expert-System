"""
Expert System Routes
=====================
POST   /api/expert/predict     — Get crop recommendation
GET    /api/expert/rules        — List all rules (authenticated)
POST   /api/expert/rules        — Add rule (admin only)
PUT    /api/expert/rules/<id>   — Update rule (admin only)
DELETE /api/expert/rules/<id>   — Delete rule (admin only)
"""
from flask import Blueprint
from controllers.expert_controller import (
    recommend, list_rules, add_rule, edit_rule, remove_rule
)
from utils.jwt_helper import jwt_required_custom, admin_required

expert_bp = Blueprint("expert", __name__, url_prefix="/api/expert")


@expert_bp.route("/predict", methods=["POST"])
@jwt_required_custom
def predict_route(current_user):
    """
    ---
    tags: [Expert System]
    summary: Get AI crop recommendation
    security: [{BearerAuth: []}]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [soilType, weather, season]
            properties:
              soilType: {type: string, enum: [sandy, clay, loamy, black, silt]}
              weather:  {type: string, enum: [hot, humid, rainy, dry, cool]}
              season:   {type: string, enum: [kharif, rabi, zaid]}
    responses:
      200: {description: Crop recommendation with fertilizer and pest control}
      404: {description: No matching rule}
    """
    return recommend(current_user)


@expert_bp.route("/rules", methods=["GET"])
@jwt_required_custom
def rules_list_route(current_user):
    """
    ---
    tags: [Expert System]
    summary: Get all knowledge base rules
    security: [{BearerAuth: []}]
    responses:
      200: {description: List of all rules}
    """
    return list_rules(current_user)


@expert_bp.route("/rules", methods=["POST"])
@admin_required
def rules_add_route(current_user):
    """
    ---
    tags: [Expert System]
    summary: Add a new rule (admin only)
    security: [{BearerAuth: []}]
    """
    return add_rule(current_user)


@expert_bp.route("/rules/<rule_id>", methods=["PUT"])
@admin_required
def rules_edit_route(rule_id, current_user):
    """
    ---
    tags: [Expert System]
    summary: Update a rule (admin only)
    security: [{BearerAuth: []}]
    """
    return edit_rule(rule_id, current_user)


@expert_bp.route("/rules/<rule_id>", methods=["DELETE"])
@admin_required
def rules_delete_route(rule_id, current_user):
    """
    ---
    tags: [Expert System]
    summary: Delete a rule (admin only)
    security: [{BearerAuth: []}]
    """
    return remove_rule(rule_id, current_user)
