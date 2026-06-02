"""
ML Model Training Script
=========================
Algorithm: Decision Tree Regressor (scikit-learn)
Target:    Crop yield in tons per hectare
Features:  soil_ph, nitrogen, phosphorus, potassium,
           temperature, rainfall, crop_type (encoded)

Run this script ONCE to generate 'saved_model.pkl' and 'label_encoder.pkl'.
The Flask API then loads these files for live predictions.

Usage:
    python ml_model/train_model.py
"""
import os
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Fix Windows console encoding
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
CSV_PATH   = os.path.join(BASE_DIR, "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "saved_model.pkl")
LE_PATH    = os.path.join(BASE_DIR, "label_encoder.pkl")
FEATURES   = ["soil_ph", "nitrogen", "phosphorus", "potassium",
              "temperature", "rainfall", "crop_type_encoded"]
TARGET     = "yield_per_hectare"


def train():
    """Train Decision Tree and save model artifacts."""
    print("\n" + "=" * 50)
    print("  Agriculture Expert System -- ML Training")
    print("=" * 50)

    # ── 1. Load dataset ───────────────────────────────────────────────────────
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] Dataset not found: {CSV_PATH}")
        sys.exit(1)

    df = pd.read_csv(CSV_PATH)
    print(f"\n[OK] Dataset loaded: {len(df)} samples, {df['crop_type'].nunique()} crop types")
    print(f"     Crops: {sorted(df['crop_type'].unique())}")

    # ── 2. Encode crop_type (string -> integer) ───────────────────────────────
    le = LabelEncoder()
    df["crop_type_encoded"] = le.fit_transform(df["crop_type"])
    print(f"\n[OK] Label encoding:")
    for i, cls in enumerate(le.classes_):
        print(f"     {cls} -> {i}")

    # ── 3. Prepare features and target ────────────────────────────────────────
    X = df[FEATURES]
    y = df[TARGET]

    # ── 4. Split: 80% train, 20% test ─────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"\n[OK] Data split: {len(X_train)} train | {len(X_test)} test")

    # ── 5. Train Decision Tree ────────────────────────────────────────────────
    model = DecisionTreeRegressor(
        max_depth=8,          # Limit depth to prevent overfitting
        min_samples_split=4,  # Node must have >=4 samples to split
        min_samples_leaf=2,   # Leaf must have >=2 samples
        random_state=42,
    )
    model.fit(X_train, y_train)
    print("\n[OK] Decision Tree trained successfully")

    # ── 6. Evaluate ───────────────────────────────────────────────────────────
    y_pred_train = model.predict(X_train)
    y_pred_test  = model.predict(X_test)

    train_r2   = r2_score(y_train, y_pred_train)
    test_r2    = r2_score(y_test,  y_pred_test)
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    test_rmse  = np.sqrt(mean_squared_error(y_test,  y_pred_test))

    print(f"\n[STATS] Model Performance:")
    print(f"        Train R2:  {train_r2:.4f}  |  Train RMSE: {train_rmse:.4f}")
    print(f"        Test  R2:  {test_r2:.4f}  |  Test  RMSE: {test_rmse:.4f}")
    print(f"        Train Accuracy: {train_r2 * 100:.1f}%")
    print(f"        Test  Accuracy: {test_r2  * 100:.1f}%")

    # ── 7. Feature importance ─────────────────────────────────────────────────
    print("\n[STATS] Feature Importance:")
    display_names = ["Soil pH", "Nitrogen", "Phosphorus", "Potassium",
                     "Temperature", "Rainfall", "Crop Type"]
    importances = model.feature_importances_
    for name, imp in sorted(zip(display_names, importances),
                            key=lambda x: x[1], reverse=True):
        bar = "#" * int(imp * 40)
        print(f"        {name:14s} {bar} {imp:.4f}")

    # ── 8. Save artifacts ─────────────────────────────────────────────────────
    joblib.dump(model, MODEL_PATH)
    joblib.dump(le,    LE_PATH)
    print(f"\n[SAVED] Model   -> {MODEL_PATH}")
    print(f"[SAVED] Encoder -> {LE_PATH}")
    print("\n" + "=" * 50)

    return model, le


if __name__ == "__main__":
    train()
