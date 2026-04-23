"""
JWT helper — decorators for protecting routes with role-based access control.
Uses Flask-JWT-Extended under the hood.
"""
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user_model import find_user_by_id


def jwt_required_custom(f):
    """
    Decorator: protect route with JWT.
    Attaches current_user dict to the function as first argument.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = find_user_by_id(user_id)
            if not user:
                return jsonify({"success": False,
                                "message": "User not found"}), 401
            if user.get("status") == "inactive":
                return jsonify({"success": False,
                                "message": "Account is inactive"}), 403
            return f(current_user=user, *args, **kwargs)
        except Exception as e:
            return jsonify({"success": False,
                            "message": "Invalid or expired token",
                            "detail": str(e)}), 401
    return decorated


def admin_required(f):
    """
    Decorator: protect route — admin only.
    Must be used AFTER jwt_required_custom.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = find_user_by_id(user_id)
            if not user:
                return jsonify({"success": False,
                                "message": "User not found"}), 401
            if user.get("role") != "admin":
                return jsonify({"success": False,
                                "message": "Admin access required"}), 403
            return f(current_user=user, *args, **kwargs)
        except Exception as e:
            return jsonify({"success": False,
                            "message": "Authorization failed",
                            "detail": str(e)}), 401
    return decorated


def roles_required(*roles):
    """
    Decorator factory: protect route by role list.
    Example: @roles_required('admin', 'farmer')
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                user = find_user_by_id(user_id)
                if not user:
                    return jsonify({"success": False,
                                    "message": "User not found"}), 401
                if user.get("role") not in roles:
                    return jsonify({
                        "success": False,
                        "message": f"Access restricted to roles: {list(roles)}"
                    }), 403
                return f(current_user=user, *args, **kwargs)
            except Exception as e:
                return jsonify({"success": False,
                                "message": "Authorization failed",
                                "detail": str(e)}), 401
        return decorated
    return decorator
