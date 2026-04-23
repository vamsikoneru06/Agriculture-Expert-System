"""
Auth Service
=============
Higher-level auth helpers used by controllers.
Keeps controller code thin and testable.
"""
from flask_jwt_extended import create_access_token
from models.user_model import find_user_by_email, verify_password


def authenticate_user(email: str, password: str) -> dict | None:
    """
    Verify credentials and return user dict (without password hash) or None.
    Used by the login controller.
    """
    user = find_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password"]):
        return None

    # Return safe dict
    return {
        "_id":   str(user["_id"]),
        "name":  user["name"],
        "email": user["email"],
        "role":  user["role"],
    }


def generate_token(user_id: str) -> str:
    """Create and return a JWT access token."""
    return create_access_token(identity=user_id)
