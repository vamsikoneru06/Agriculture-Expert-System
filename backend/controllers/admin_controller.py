"""
Admin Controller
=================
Admin-only operations: user management, stats, prediction history.
All functions receive current_user (must have role='admin') from the decorator.
"""
from flask import request
from models.user_model import get_all_users, update_user_status, delete_user
from models.prediction_model import (
    get_all_predictions, get_user_predictions,
    delete_prediction, get_stats
)
from models.rule_model import count_rules
from utils.response_helper import (
    success_response, error_response, not_found_response
)


def list_users(current_user: dict):
    """GET /api/admin/users — Return all users."""
    try:
        users = get_all_users()
        return success_response(
            data={"users": users, "total": len(users)},
            message="Users fetched"
        )
    except Exception as e:
        return error_response(f"Error: {str(e)}", 500)


def modify_user(user_id: str, current_user: dict):
    """
    PUT /api/admin/users/<user_id>
    Toggle user status: active ↔ inactive.
    """
    data   = request.get_json(silent=True) or {}
    status = data.get("status", "active")

    if status not in {"active", "inactive"}:
        return error_response("status must be 'active' or 'inactive'", 422)

    try:
        success = update_user_status(user_id, status)
        if success:
            return success_response(
                message=f"User status updated to '{status}'"
            )
        return not_found_response("User")
    except Exception as e:
        return error_response(f"Update error: {str(e)}", 500)


def remove_user(user_id: str, current_user: dict):
    """DELETE /api/admin/users/<user_id> — Hard-delete a user."""
    # Prevent self-deletion
    if user_id == current_user["_id"]:
        return error_response("You cannot delete your own account", 400)

    try:
        success = delete_user(user_id)
        if success:
            return success_response(message="User deleted successfully")
        return not_found_response("User")
    except Exception as e:
        return error_response(f"Deletion error: {str(e)}", 500)


def system_stats(current_user: dict):
    """GET /api/admin/stats — Return system-wide analytics."""
    try:
        stats = get_stats()
        return success_response(data=stats, message="Stats fetched")
    except Exception as e:
        return error_response(f"Stats error: {str(e)}", 500)


def all_predictions(current_user: dict):
    """GET /api/admin/predictions — Return all prediction history (admin)."""
    try:
        limit = int(request.args.get("limit", 100))
        preds = get_all_predictions(limit=limit)
        return success_response(
            data={"predictions": preds, "total": len(preds)},
            message="Predictions fetched"
        )
    except Exception as e:
        return error_response(f"Error: {str(e)}", 500)


def user_predictions_history(current_user: dict):
    """GET /api/predictions — Return predictions for the logged-in user."""
    try:
        limit = int(request.args.get("limit", 50))
        preds = get_user_predictions(current_user["_id"], limit=limit)
        return success_response(
            data={"predictions": preds, "total": len(preds)},
            message="Your prediction history"
        )
    except Exception as e:
        return error_response(f"Error: {str(e)}", 500)


def remove_prediction(prediction_id: str, current_user: dict):
    """DELETE /api/predictions/<id> — Delete a prediction entry."""
    try:
        success = delete_prediction(prediction_id)
        if success:
            return success_response(message="Prediction deleted")
        return not_found_response("Prediction")
    except Exception as e:
        return error_response(f"Deletion error: {str(e)}", 500)
