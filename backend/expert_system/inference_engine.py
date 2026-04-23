"""
Rule-Based Inference Engine
============================
Implements forward-chaining IF-THEN logic.

Algorithm:
  1. Accept user inputs: soilType, weather, season
  2. Query MongoDB rules collection for exact matches
  3. If exact match found → return recommendation
  4. If no exact match → apply partial matching (2 out of 3 conditions)
  5. Return best match or None

This simulates a simplified forward-chaining expert system.
"""
from models.rule_model import find_matching_rules, get_all_rules


def run_inference(soil_type: str, weather: str, season: str) -> dict | None:
    """
    Main inference function.

    Parameters
    ----------
    soil_type : str  (sandy | clay | loamy | black | silt)
    weather   : str  (hot | humid | rainy | dry | cool)
    season    : str  (kharif | rabi | zaid)

    Returns
    -------
    dict  — the best-matching rule output, or None if no match found.
    """

    # ── Step 1: Exact match ──────────────────────────────────────────────────
    exact_matches = find_matching_rules(soil_type, weather, season)

    if exact_matches:
        # Pick the rule with highest confidence
        best = max(exact_matches, key=lambda r: r["output"].get("confidence", 0))
        return _format_result(best, match_type="exact")

    # ── Step 2: Partial match (2 out of 3 conditions) ───────────────────────
    all_rules = get_all_rules()
    scored = []

    for rule in all_rules:
        cond = rule.get("conditions", {})
        score = 0
        if cond.get("soilType") == soil_type: score += 3  # highest weight
        if cond.get("weather")  == weather:   score += 2
        if cond.get("season")   == season:    score += 1
        if score >= 3:  # at least soil + one other condition
            scored.append((score, rule))

    if scored:
        # Sort by score descending, then confidence descending
        scored.sort(key=lambda x: (x[0], x[1]["output"].get("confidence", 0)), reverse=True)
        best_rule = scored[0][1]
        return _format_result(best_rule, match_type="partial",
                              score=scored[0][0])

    # ── Step 3: No match ─────────────────────────────────────────────────────
    return None


def _format_result(rule: dict, match_type: str = "exact", score: int = 6) -> dict:
    """Attach metadata to the raw rule output."""
    output = dict(rule.get("output", {}))
    output["rule_id"]    = rule.get("rule_id")
    output["match_type"] = match_type

    # Slightly reduce confidence for partial matches
    if match_type == "partial":
        output["confidence"] = max(50, output.get("confidence", 80) - 10)
        output["note"] = "Partial match — recommendation based on closest conditions"

    return output


def validate_inputs(soil_type: str, weather: str, season: str) -> list[str]:
    """
    Return a list of validation errors.
    An empty list means inputs are valid.
    """
    errors = []
    valid_soils   = {"sandy", "clay", "loamy", "black", "silt"}
    valid_weather = {"hot", "humid", "rainy", "dry", "cool"}
    valid_seasons = {"kharif", "rabi", "zaid"}

    if soil_type not in valid_soils:
        errors.append(f"Invalid soilType '{soil_type}'. Must be one of {sorted(valid_soils)}")
    if weather not in valid_weather:
        errors.append(f"Invalid weather '{weather}'. Must be one of {sorted(valid_weather)}")
    if season not in valid_seasons:
        errors.append(f"Invalid season '{season}'. Must be one of {sorted(valid_seasons)}")

    return errors
