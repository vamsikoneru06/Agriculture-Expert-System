"""
Rule model — CRUD for the expert system knowledge base ('rules' collection).
Each rule document has `conditions` (IF) and `output` (THEN).
"""
from datetime import datetime, timezone
from bson import ObjectId
from config.database import get_db


def _serialize(rule: dict) -> dict:
    if rule:
        rule["_id"] = str(rule["_id"])
    return rule


def get_all_rules() -> list:
    """Return all rules sorted by rule_id."""
    db = get_db()
    rules = list(db.rules.find({}).sort("rule_id", 1))
    return [_serialize(r) for r in rules]


def get_rule_by_id(rule_id: str) -> dict | None:
    db = get_db()
    try:
        rule = db.rules.find_one({"_id": ObjectId(rule_id)})
        return _serialize(rule)
    except Exception:
        return None


def find_matching_rules(soil_type: str, weather: str, season: str) -> list:
    """
    Exact-match query: find rules whose conditions all match the inputs.
    Returns a list so the engine can pick the best one.
    """
    db = get_db()
    query = {
        "conditions.soilType": soil_type,
        "conditions.weather":  weather,
        "conditions.season":   season,
    }
    rules = list(db.rules.find(query))
    return [_serialize(r) for r in rules]


def create_rule(conditions: dict, output: dict, created_by: str = "system") -> dict:
    """Insert a new rule into the knowledge base."""
    db = get_db()

    # Auto-assign rule_id (sequential)
    last = db.rules.find_one({}, sort=[("rule_id", -1)])
    next_id = (last["rule_id"] + 1) if last else 1

    doc = {
        "rule_id":    next_id,
        "conditions": conditions,   # {soilType, weather, season}
        "output":     output,       # {crop, fertilizer, pestControl, ...}
        "created_by": created_by,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = db.rules.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


def update_rule(rule_id: str, conditions: dict, output: dict) -> bool:
    """Update an existing rule's conditions or output."""
    db = get_db()
    try:
        result = db.rules.update_one(
            {"_id": ObjectId(rule_id)},
            {"$set": {
                "conditions": conditions,
                "output":     output,
                "updated_at": datetime.now(timezone.utc),
            }}
        )
        return result.modified_count > 0
    except Exception:
        return False


def delete_rule(rule_id: str) -> bool:
    """Remove a rule from the knowledge base."""
    db = get_db()
    try:
        result = db.rules.delete_one({"_id": ObjectId(rule_id)})
        return result.deleted_count > 0
    except Exception:
        return False


def count_rules() -> int:
    return get_db().rules.count_documents({})
