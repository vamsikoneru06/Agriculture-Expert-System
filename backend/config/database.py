"""
MongoDB connection manager.
Uses a single MongoClient instance (connection pooling is handled internally).
"""
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config.settings import AppConfig

_client = None
_db = None


def init_db(app):
    """
    Initialize MongoDB connection and attach `db` to the Flask app.
    Call this once during app startup (app.py).
    """
    global _client, _db

    try:
        _client = MongoClient(
            AppConfig.MONGO_URI,
            serverSelectionTimeoutMS=10000,
            tls=True,
            tlsAllowInvalidCertificates=True,
        )
        # Verify connection
        _client.admin.command("ping")
        _db = _client[AppConfig.DB_NAME]
        app.db = _db  # attach to Flask app for easy access

        # Create indexes for performance
        _create_indexes(_db)

        print(f"[OK]    MongoDB connected -> database: '{AppConfig.DB_NAME}'")
    except ConnectionFailure as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        print("[INFO]  Make sure MongoDB is running: net start MongoDB")
        raise


def get_db():
    """Return the active database instance."""
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_db(app) first.")
    return _db


def _create_indexes(db):
    """Create useful indexes so queries are fast."""
    db.users.create_index("email", unique=True)
    db.rules.create_index([("conditions.soilType", 1),
                           ("conditions.weather", 1),
                           ("conditions.season", 1)])
    db.predictions.create_index([("user_id", 1), ("created_at", -1)])
