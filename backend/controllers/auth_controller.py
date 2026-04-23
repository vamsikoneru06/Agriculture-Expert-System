"""
Auth Controller
================
Handles user registration, login, and profile retrieval.
All functions accept a Flask request object and return (response, status).
"""
from flask import request
from flask_jwt_extended import create_access_token
from models.user_model import (
    create_user, find_user_by_email, find_user_by_id, verify_password
)
from utils.validators import validate_registration, validate_login
from utils.response_helper import (
    success_response, error_response, created_response
)


def register():
    """
    POST /api/auth/register
    Create a new user account.
    """
    data = request.get_json(silent=True) or {}

    # ── Validate input ────────────────────────────────────────────────────────
    errors = validate_registration(data)
    if errors:
        return error_response("Validation failed", 422, errors)

    try:
        # ── Create user (password is hashed inside user_model) ───────────────
        user = create_user(
            name=data["name"],
            email=data["email"],
            password=data["password"],
            role=data.get("role", "farmer"),
        )

        # ── Issue JWT token ───────────────────────────────────────────────────
        token = create_access_token(identity=user["_id"])

        return created_response(
            data={"user": user, "token": token},
            message="Account created successfully"
        )

    except ValueError as e:
        # Duplicate email or invalid role
        return error_response(str(e), 409)
    except Exception as e:
        return error_response(f"Registration failed: {str(e)}", 500)


def login():
    """
    POST /api/auth/login
    Authenticate user and return JWT token.
    """
    data = request.get_json(silent=True) or {}

    errors = validate_login(data)
    if errors:
        return error_response("Validation failed", 422, errors)

    try:
        # ── Find user ─────────────────────────────────────────────────────────
        user = find_user_by_email(data["email"])
        if not user:
            return error_response("Invalid email or password", 401)

        # ── Check password ────────────────────────────────────────────────────
        if not verify_password(data["password"], user["password"]):
            return error_response("Invalid email or password", 401)

        # ── Check account status ──────────────────────────────────────────────
        if user.get("status") == "inactive":
            return error_response("Your account has been deactivated", 403)

        # ── Build safe user dict (no password) ────────────────────────────────
        safe_user = {
            "_id":  str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role":  user["role"],
        }

        # ── Issue JWT ─────────────────────────────────────────────────────────
        token = create_access_token(identity=safe_user["_id"])

        return success_response(
            data={"user": safe_user, "token": token},
            message="Login successful"
        )

    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)


def get_profile(current_user: dict):
    """
    GET /api/auth/me   (JWT protected)
    Return the authenticated user's profile.
    """
    return success_response(data={"user": current_user})
