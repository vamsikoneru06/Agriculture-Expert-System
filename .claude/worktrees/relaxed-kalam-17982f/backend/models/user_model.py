"""
User model — CRUD operations against the 'users' MongoDB collection.
Passwords are NEVER stored in plain text; always use bcrypt hashes.
"""
from datetime import datetime, timezone
from bson import ObjectId
import bcrypt
from config.database import get_db

VALID_ROLES = {"admin", "farmer", "student"}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _serialize(user: dict) -> dict:
    """Convert MongoDB document to JSON-safe dict (ObjectId → string)."""
    if user:
        user["_id"] = str(user["_id"])
    return user


# ── Core operations ──────────────────────────────────────────────────────────

def create_user(name: str, email: str, password: str, role: str = "farmer") -> dict:
    """
    Hash the password and insert a new user document.
    Returns the inserted document (without password hash).
    Raises ValueError for duplicate email.
    """
    db = get_db()

    if role not in VALID_ROLES:
        raise ValueError(f"Role must be one of {VALID_ROLES}")

    # Check for existing email
    if db.users.find_one({"email": email.lower()}):
        raise ValueError("Email already registered")

    # Hash password with bcrypt (cost factor 12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))

    doc = {
        "name":       name.strip(),
        "email":      email.lower().strip(),
        "password":   hashed,          # bytes – stored as binary in MongoDB
        "role":       role,
        "status":     "active",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    result = db.users.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    doc.pop("password")  # never expose hash
    return doc


def find_user_by_email(email: str) -> dict | None:
    """Return user document (including password hash) or None."""
    db = get_db()
    return db.users.find_one({"email": email.lower().strip()})


def find_user_by_id(user_id: str) -> dict | None:
    """Return user document (without password) by ObjectId string."""
    db = get_db()
    try:
        user = db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0}   # project out password
        )
        return _serialize(user)
    except Exception:
        return None


def verify_password(plain: str, hashed: bytes) -> bool:
    """Compare a plain-text password against the stored bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed)


def get_all_users() -> list:
    """Return all users (without passwords) for admin view."""
    db = get_db()
    users = list(db.users.find({}, {"password": 0}).sort("created_at", -1))
    return [_serialize(u) for u in users]


def update_user_status(user_id: str, status: str) -> bool:
    """Toggle user active/inactive status (admin action)."""
    db = get_db()
    result = db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    return result.modified_count > 0


def delete_user(user_id: str) -> bool:
    """Hard-delete a user document (admin only)."""
    db = get_db()
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0
