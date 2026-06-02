"""
Database Seeder
================
Populates MongoDB with initial data:
  1. Admin user
  2. All 25 expert rules
  3. Crop catalogue
  4. Sample predictions (for dashboard demo)

Run manually:
    python seed/seed_db.py

Or called automatically from app.py on first startup.
"""
import sys
import os

# Ensure parent directory is on the path when run directly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import init_db, get_db
from expert_system.rules_data import EXPERT_RULES
from models.crop_model import CROP_CATALOGUE
from flask import Flask
from config.settings import AppConfig
import bcrypt
from datetime import datetime, timezone


def seed_all():
    """Run full database seed."""
    print("\n" + "=" * 55)
    print("  Agriculture Expert System -- Database Seeder")
    print("=" * 55)

    db = get_db()

    # ── 1. Admin user ─────────────────────────────────────────────────────────
    print("\n[1/4] Seeding users ...")
    demo_users = [
        {"name": "Admin User",    "email": "admin@agri.com",   "password": "admin123",   "role": "admin"},
        {"name": "Farmer Teja",  "email": "farmer@agri.com",  "password": "farmer123",  "role": "farmer"},
        {"name": "Student Sai",  "email": "student@agri.com", "password": "student123", "role": "student"},
    ]
    created_users = 0
    for u in demo_users:
        if not db.users.find_one({"email": u["email"]}):
            hashed = bcrypt.hashpw(u["password"].encode("utf-8"), bcrypt.gensalt(rounds=12))
            db.users.insert_one({
                "name":       u["name"],
                "email":      u["email"],
                "password":   hashed,
                "role":       u["role"],
                "status":     "active",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            })
            created_users += 1
            print(f"   [CREATED] {u['role']}: {u['email']}")
        else:
            print(f"   [SKIPPED] already exists: {u['email']}")
    print(f"   -> {created_users} new user(s) created")

    # ── 2. Expert rules ───────────────────────────────────────────────────────
    print("\n[2/4] Seeding expert rules ...")
    if db.rules.count_documents({}) == 0:
        db.rules.insert_many(EXPERT_RULES)
        print(f"   [OK] Inserted {len(EXPERT_RULES)} expert rules")
    else:
        existing = db.rules.count_documents({})
        print(f"   [SKIPPED] {existing} rules already exist")

    # ── 3. Crop catalogue ─────────────────────────────────────────────────────
    print("\n[3/4] Seeding crop catalogue ...")
    if db.crops.count_documents({}) == 0:
        db.crops.insert_many(CROP_CATALOGUE)
        print(f"   [OK] Inserted {len(CROP_CATALOGUE)} crops")
    else:
        print(f"   [SKIPPED] crops already seeded")

    # ── 4. Sample predictions ─────────────────────────────────────────────────
    print("\n[4/4] Seeding sample predictions ...")
    if db.predictions.count_documents({}) == 0:
        farmer = db.users.find_one({"role": "farmer"})
        if farmer:
            sample_preds = [
                {
                    "user_id": str(farmer["_id"]),
                    "prediction_type": "expert",
                    "inputs": {"soilType": "clay", "weather": "humid", "season": "kharif"},
                    "output": {"crop": "Rice (Paddy)", "confidence": 97},
                    "created_at": datetime.now(timezone.utc),
                },
                {
                    "user_id": str(farmer["_id"]),
                    "prediction_type": "ml",
                    "inputs": {"crop_type": "wheat", "soil_ph": 6.5, "nitrogen": 120},
                    "output": {"yield_per_hectare": 4.2, "grade": "Good", "confidence": 91},
                    "created_at": datetime.now(timezone.utc),
                },
                {
                    "user_id": str(farmer["_id"]),
                    "prediction_type": "expert",
                    "inputs": {"soilType": "loamy", "weather": "hot", "season": "kharif"},
                    "output": {"crop": "Cotton", "confidence": 91},
                    "created_at": datetime.now(timezone.utc),
                },
            ]
            db.predictions.insert_many(sample_preds)
            print(f"   [OK] Inserted {len(sample_preds)} sample predictions")
        else:
            print("   [WARN] No farmer user found -- skipping sample predictions")
    else:
        print(f"   [SKIPPED] predictions already exist")

    print("\n" + "=" * 55)
    print("  Seeding complete!")
    print("=" * 55 + "\n")


if __name__ == "__main__":
    app = Flask(__name__)
    app.config["MONGO_URI"] = AppConfig.MONGO_URI
    app.config["DB_NAME"]   = AppConfig.DB_NAME

    with app.app_context():
        init_db(app)
        seed_all()
