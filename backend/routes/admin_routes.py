"""
Admin Routes
=============
GET    /api/admin/users         — List all users
PUT    /api/admin/users/<id>    — Update user status
DELETE /api/admin/users/<id>    — Delete user
GET    /api/admin/stats         — System statistics
GET    /api/admin/predictions   — All predictions
GET    /api/predictions         — My predictions (any user)
DELETE /api/predictions/<id>    — Delete a prediction
"""
from flask import Blueprint
from controllers.admin_controller import (
    list_users, modify_user, remove_user,
    system_stats, all_predictions,
    user_predictions_history, remove_prediction,
)
from utils.jwt_helper import admin_required, jwt_required_custom

admin_bp = Blueprint("admin", __name__)


# ── Admin-only endpoints ──────────────────────────────────────────────────────
@admin_bp.route("/api/admin/users", methods=["GET"])
@admin_required
def users_list_route(current_user):
    return list_users(current_user)


@admin_bp.route("/api/admin/users/<user_id>", methods=["PUT"])
@admin_required
def users_modify_route(user_id, current_user):
    return modify_user(user_id, current_user)


@admin_bp.route("/api/admin/users/<user_id>", methods=["DELETE"])
@admin_required
def users_delete_route(user_id, current_user):
    return remove_user(user_id, current_user)


@admin_bp.route("/api/admin/stats", methods=["GET"])
@admin_required
def stats_route(current_user):
    return system_stats(current_user)


@admin_bp.route("/api/admin/predictions", methods=["GET"])
@admin_required
def admin_predictions_route(current_user):
    return all_predictions(current_user)


# ── Any authenticated user — their own predictions ────────────────────────────
@admin_bp.route("/api/predictions", methods=["GET"])
@jwt_required_custom
def my_predictions_route(current_user):
    return user_predictions_history(current_user)


@admin_bp.route("/api/predictions/<prediction_id>", methods=["DELETE"])
@jwt_required_custom
def delete_prediction_route(prediction_id, current_user):
    return remove_prediction(prediction_id, current_user)
