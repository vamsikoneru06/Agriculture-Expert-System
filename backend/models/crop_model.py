"""
Crop model — stores static crop reference data in the 'crops' collection.
Used to enrich recommendations with growing tips and nutrient requirements.
"""
from bson import ObjectId
from config.database import get_db

CROP_CATALOGUE = [
    {
        "name": "Wheat",        "emoji": "🌿",
        "season": "rabi",       "water_need": "moderate",
        "npk_ratio": "6:2:2",   "days_to_harvest": 120,
        "description": "Major winter cereal; grows best in loamy soil with cool temperatures.",
    },
    {
        "name": "Rice",         "emoji": "🍚",
        "season": "kharif",     "water_need": "high",
        "npk_ratio": "4:2:2",   "days_to_harvest": 130,
        "description": "Staple food crop; requires standing water and high humidity.",
    },
    {
        "name": "Maize",        "emoji": "🌽",
        "season": "kharif",     "water_need": "moderate",
        "npk_ratio": "4:2:2",   "days_to_harvest": 90,
        "description": "Versatile cereal; used as food, feed, and industrial crop.",
    },
    {
        "name": "Cotton",       "emoji": "🌸",
        "season": "kharif",     "water_need": "moderate",
        "npk_ratio": "3:1.5:1.5", "days_to_harvest": 180,
        "description": "Cash crop; requires long frost-free season and deep soil.",
    },
    {
        "name": "Soybean",      "emoji": "🫘",
        "season": "kharif",     "water_need": "moderate",
        "npk_ratio": "1:2:2",   "days_to_harvest": 100,
        "description": "Nitrogen-fixing legume; improves soil health.",
    },
    {
        "name": "Potato",       "emoji": "🥔",
        "season": "rabi",       "water_need": "high",
        "npk_ratio": "4:3:5",   "days_to_harvest": 90,
        "description": "Tuber crop; requires cool temperatures and well-drained loamy soil.",
    },
    {
        "name": "Chickpea",     "emoji": "🫘",
        "season": "rabi",       "water_need": "low",
        "npk_ratio": "1:2:2",   "days_to_harvest": 100,
        "description": "Drought-tolerant legume; fixes atmospheric nitrogen.",
    },
    {
        "name": "Pearl Millet", "emoji": "🌾",
        "season": "kharif",     "water_need": "low",
        "npk_ratio": "4:2:2",   "days_to_harvest": 70,
        "description": "Drought-tolerant cereal; ideal for arid and sandy soils.",
    },
    {
        "name": "Sugarcane",    "emoji": "🎋",
        "season": "kharif",     "water_need": "very_high",
        "npk_ratio": "10:5:5",  "days_to_harvest": 365,
        "description": "Long-duration commercial crop; needs fertile soil and plenty of water.",
    },
    {
        "name": "Tomato",       "emoji": "🍅",
        "season": "zaid",       "water_need": "moderate",
        "npk_ratio": "5:3:3",   "days_to_harvest": 70,
        "description": "High-value vegetable; needs warm climate and well-drained loamy soil.",
    },
]


def seed_crops():
    """Insert crop catalogue if collection is empty."""
    db = get_db()
    if db.crops.count_documents({}) == 0:
        db.crops.insert_many(CROP_CATALOGUE)
        print(f"   ↳ Seeded {len(CROP_CATALOGUE)} crops")


def get_all_crops() -> list:
    db = get_db()
    crops = list(db.crops.find({}, {"_id": 0}))
    return crops


def get_crop_by_name(name: str) -> dict | None:
    db = get_db()
    return db.crops.find_one({"name": {"$regex": name, "$options": "i"}}, {"_id": 0})
