"""
Prediction model — stores the history of all expert-system and ML predictions.
"""
from datetime import datetime, timezone
from bson import ObjectId
from config.database import get_db


def _serialize(doc: dict) -> dict:
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc


def save_prediction(user_id: str, prediction_type: str,
                    inputs: dict, output: dict) -> dict:
    """
    Persist a prediction result to the 'predictions' collection.

    prediction_type: 'expert' | 'ml'
    inputs:  raw user-supplied parameters
    output:  the recommendation/prediction result
    """
    db = get_db()
    doc = {
        "user_id":          user_id,
        "prediction_type":  prediction_type,   # 'expert' or 'ml'
        "inputs":           inputs,
        "output":           output,
        "created_at":       datetime.now(timezone.utc),
    }
    result = db.predictions.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


def get_user_predictions(user_id: str, limit: int = 50) -> list:
    """Return predictions for a specific user (newest first)."""
    db = get_db()
    preds = list(
        db.predictions
        .find({"user_id": user_id})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [_serialize(p) for p in preds]


def get_all_predictions(limit: int = 100) -> list:
    """Admin: return all predictions across all users."""
    db = get_db()
    preds = list(
        db.predictions
        .find({})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [_serialize(p) for p in preds]


def delete_prediction(prediction_id: str) -> bool:
    db = get_db()
    try:
        result = db.predictions.delete_one({"_id": ObjectId(prediction_id)})
        return result.deleted_count > 0
    except Exception:
        return False


def get_stats() -> dict:
    """Aggregate statistics for the admin dashboard."""
    db = get_db()
    total_predictions = db.predictions.count_documents({})
    expert_count = db.predictions.count_documents({"prediction_type": "expert"})
    ml_count     = db.predictions.count_documents({"prediction_type": "ml"})

    # Count unique users who made predictions
    unique_users = len(db.predictions.distinct("user_id"))

    return {
        "total_predictions": total_predictions,
        "expert_predictions": expert_count,
        "ml_predictions":    ml_count,
        "unique_users":      unique_users,
        "total_users":       db.users.count_documents({}),
        "total_rules":       db.rules.count_documents({}),
    }
