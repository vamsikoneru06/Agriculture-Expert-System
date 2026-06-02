"""
Expert System Controller
=========================
Handles crop recommendation via rule-based inference engine.
"""
from flask import request
from expert_system.inference_engine import run_inference
from models.rule_model import (
    get_all_rules, get_rule_by_id, create_rule,
    update_rule, delete_rule
)
from models.prediction_model import save_prediction
from utils.validators import validate_expert_input, validate_rule
from utils.response_helper import (
    success_response, error_response, created_response, not_found_response
)


def recommend(current_user: dict):
    """
    POST /api/expert/predict
    Run inference engine and return crop recommendation.
    """
    data = request.get_json(silent=True) or {}

    # ── Validate inputs ───────────────────────────────────────────────────────
    errors = validate_expert_input(data)
    if errors:
        return error_response("Invalid input parameters", 422, errors)

    soil_type = data["soilType"]
    weather   = data["weather"]
    season    = data["season"]

    try:
        # ── Run rule-based inference ──────────────────────────────────────────
        result = run_inference(soil_type, weather, season)

        if not result:
            return error_response(
                "No matching rule found for the given conditions. "
                "Try a different combination of soil, weather, and season.",
                404
            )

        # ── Save to prediction history ────────────────────────────────────────
        inputs = {"soilType": soil_type, "weather": weather, "season": season}
        save_prediction(
            user_id         = current_user["_id"],
            prediction_type = "expert",
            inputs          = inputs,
            output          = result,
        )

        return success_response(
            data={
                "inputs": inputs,
                "output": result,
                "inference_type": "rule_based",
            },
            message="Recommendation generated successfully"
        )

    except Exception as e:
        return error_response(f"Inference engine error: {str(e)}", 500)


def list_rules(current_user: dict):
    """GET /api/expert/rules — Return all rules in the knowledge base."""
    try:
        rules = get_all_rules()
        return success_response(
            data={"rules": rules, "total": len(rules)},
            message="Rules fetched successfully"
        )
    except Exception as e:
        return error_response(f"Failed to fetch rules: {str(e)}", 500)


def add_rule(current_user: dict):
    """POST /api/expert/rules — Add a new rule (admin only)."""
    data = request.get_json(silent=True) or {}

    errors = validate_rule(data)
    if errors:
        return error_response("Rule validation failed", 422, errors)

    try:
        rule = create_rule(
            conditions = data["conditions"],
            output     = data["output"],
            created_by = current_user["_id"],
        )
        return created_response(data={"rule": rule},
                                message="Rule added to knowledge base")
    except Exception as e:
        return error_response(f"Failed to add rule: {str(e)}", 500)


def edit_rule(rule_id: str, current_user: dict):
    """PUT /api/expert/rules/<rule_id> — Update an existing rule."""
    data = request.get_json(silent=True) or {}

    errors = validate_rule(data)
    if errors:
        return error_response("Rule validation failed", 422, errors)

    existing = get_rule_by_id(rule_id)
    if not existing:
        return not_found_response("Rule")

    try:
        success = update_rule(rule_id, data["conditions"], data["output"])
        if success:
            return success_response(message="Rule updated successfully")
        return error_response("Rule update failed", 500)
    except Exception as e:
        return error_response(f"Update error: {str(e)}", 500)


def remove_rule(rule_id: str, current_user: dict):
    """DELETE /api/expert/rules/<rule_id> — Remove a rule (admin only)."""
    existing = get_rule_by_id(rule_id)
    if not existing:
        return not_found_response("Rule")

    try:
        success = delete_rule(rule_id)
        if success:
            return success_response(message="Rule deleted from knowledge base")
        return error_response("Deletion failed", 500)
    except Exception as e:
        return error_response(f"Deletion error: {str(e)}", 500)
