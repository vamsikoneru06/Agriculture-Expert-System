"""
Application configuration loaded from .env file.
All sensitive values are stored outside source code.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base configuration shared by all environments."""

    # Flask core
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
    DEBUG = False
    TESTING = False

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME = os.getenv("DB_NAME", "agriculture_expert_db")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))
    )

    # Admin registration secret key
    ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "AGRI-ADMIN-2025")

    # CORS — supports comma-separated list for multiple origins
    _cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    CORS_ORIGINS = [o.strip() for o in _cors_raw.split(",")] if "," in _cors_raw else _cors_raw


class DevelopmentConfig(Config):
    """Development-specific settings."""
    DEBUG = True


class ProductionConfig(Config):
    """Production-specific settings."""
    DEBUG = False


# Select config based on FLASK_ENV
ENV = os.getenv("FLASK_ENV", "development")
config_map = {
    "development": DevelopmentConfig,
    "production":  ProductionConfig,
}
AppConfig = config_map.get(ENV, DevelopmentConfig)
