"""
Standard API response helpers.
All endpoints use these functions so responses are consistent.
"""
from flask import jsonify


def success_response(data=None, message="Success", status_code=200):
    """Return a standard success JSON response."""
    payload = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code


def error_response(message="An error occurred", status_code=400, errors=None):
    """Return a standard error JSON response."""
    payload = {"success": False, "message": message}
    if errors:
        payload["errors"] = errors
    return jsonify(payload), status_code


def created_response(data=None, message="Created successfully"):
    """Convenience wrapper for 201 Created."""
    return success_response(data=data, message=message, status_code=201)


def not_found_response(resource="Resource"):
    """Convenience wrapper for 404 Not Found."""
    return error_response(message=f"{resource} not found", status_code=404)


def unauthorized_response(message="Unauthorized. Please log in."):
    """Convenience wrapper for 401 Unauthorized."""
    return error_response(message=message, status_code=401)


def forbidden_response(message="Forbidden. Insufficient permissions."):
    """Convenience wrapper for 403 Forbidden."""
    return error_response(message=message, status_code=403)
