"""
Agriculture Expert System — Flask Backend
==========================================
Entry point. Creates the Flask app, initialises extensions,
registers blueprints, seeds the database, and starts the server.

Run:
    python app.py
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flasgger import Swagger

from config.settings import AppConfig
from config.database import init_db
from routes.auth_routes import auth_bp
from routes.expert_routes import expert_bp
from routes.simulation_routes import simulation_bp
from routes.ml_routes import ml_bp
from routes.admin_routes import admin_bp
from routes.chat_routes import chat_bp


# ── Swagger / OpenAPI config ──────────────────────────────────────────────────
SWAGGER_CONFIG = {
    "headers": [],
    "specs": [{
        "endpoint":     "apispec",
        "route":        "/apispec.json",
        "rule_filter":  lambda rule: True,
        "model_filter": lambda tag: True,
    }],
    "static_url_path": "/flasgger_static",
    "swagger_ui":       True,
    "specs_route":      "/api/docs",
}

SWAGGER_TEMPLATE = {
    "swagger": "2.0",
    "info": {
        "title":       "Agriculture Expert System API",
        "description": "REST API for AI-powered crop recommendations, simulation, and ML yield prediction",
        "version":     "1.0.0",
        "contact":     {"email": "support@agriexpert.com"},
    },
    "host":     "localhost:5000",
    "basePath": "/",
    "schemes":  ["http"],
    "securityDefinitions": {
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in":   "header",
            "description": "Enter: Bearer <your_jwt_token>",
        }
    },
    "consumes": ["application/json"],
    "produces": ["application/json"],
}


def create_app() -> Flask:
    """
    Flask Application Factory.
    Creates and configures the Flask app instance.
    """
    app = Flask(__name__)

    # ── Load config ───────────────────────────────────────────────────────────
    app.config["SECRET_KEY"]               = AppConfig.SECRET_KEY
    app.config["JWT_SECRET_KEY"]           = AppConfig.JWT_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = AppConfig.JWT_ACCESS_TOKEN_EXPIRES
    app.config["DEBUG"]                    = AppConfig.DEBUG

    # ── CORS — open to all origins (agriculture education app) ───────────────
    CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    # ── JWT ───────────────────────────────────────────────────────────────────
    JWTManager(app)

    # ── MongoDB ───────────────────────────────────────────────────────────────
    init_db(app)

    # ── Swagger UI ────────────────────────────────────────────────────────────
    Swagger(app, config=SWAGGER_CONFIG, template=SWAGGER_TEMPLATE)

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(auth_bp)
    app.register_blueprint(expert_bp)
    app.register_blueprint(simulation_bp)
    app.register_blueprint(ml_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(chat_bp)

    # ── Health check endpoint ─────────────────────────────────────────────────
    @app.route("/", methods=["GET"])
    def health():
        return jsonify({
            "success": True,
            "message": "Agriculture Expert System API is running 🌾",
            "version": "1.0.0",
            "docs":    "http://localhost:5000/api/docs",
        })

    # ── Global error handlers ─────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "message": "Method not allowed"}), 405

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "Internal server error"}), 500

    # ── Seed database on first run ────────────────────────────────────────────
    with app.app_context():
        _auto_seed(app)

    # ── Train ML model if not already trained ─────────────────────────────────
    _ensure_ml_model()

    return app


def _auto_seed(app: Flask):
    """Seed the database with initial data if it is empty."""
    db = app.db
    if db.rules.count_documents({}) == 0:
        print("\n[INFO] Database is empty -- running auto-seed ...")
        from seed.seed_db import seed_all
        seed_all()
    else:
        print(f"[INFO] Database already has data -- skipping auto-seed")


def _ensure_ml_model():
    """Train the ML model if saved artifacts don't exist yet."""
    import os
    model_path = os.path.join("ml_model", "saved_model.pkl")
    if not os.path.exists(model_path):
        print("\n[INFO] ML model not found -- training now ...")
        from ml_model.train_model import train
        train()
    else:
        print("[OK]   ML model found -- ready for predictions")


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app = create_app()
    print("\n" + "=" * 55)
    print("  Agriculture Expert System Backend")
    print("  Running on  http://localhost:5000")
    print("  API Docs    http://localhost:5000/api/docs")
    print("=" * 55 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=AppConfig.DEBUG)
