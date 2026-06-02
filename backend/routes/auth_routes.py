"""
Auth Routes
============
POST /api/auth/register  — Create account
POST /api/auth/login     — Login and receive JWT
GET  /api/auth/me        — Get profile (JWT required)
"""
from flask import Blueprint
from controllers.auth_controller import register, login, get_profile
from utils.jwt_helper import jwt_required_custom

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register_route():
    """
    ---
    tags: [Auth]
    summary: Register a new user
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [name, email, password]
            properties:
              name:     {type: string, example: "Ravi Kumar"}
              email:    {type: string, example: "ravi@example.com"}
              password: {type: string, example: "secret123"}
              role:     {type: string, enum: [admin, farmer, student], example: farmer}
    responses:
      201: {description: Account created}
      409: {description: Email already registered}
      422: {description: Validation error}
    """
    return register()


@auth_bp.route("/login", methods=["POST"])
def login_route():
    """
    ---
    tags: [Auth]
    summary: Login and receive JWT
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password]
            properties:
              email:    {type: string, example: "ravi@example.com"}
              password: {type: string, example: "secret123"}
    responses:
      200: {description: Login successful with JWT token}
      401: {description: Invalid credentials}
    """
    return login()


@auth_bp.route("/me", methods=["GET"])
@jwt_required_custom
def profile_route(current_user):
    """
    ---
    tags: [Auth]
    summary: Get current user profile
    security: [{BearerAuth: []}]
    responses:
      200: {description: User profile}
      401: {description: Token invalid}
    """
    return get_profile(current_user)
