"""
Chat Controller — LLM-powered agricultural assistant using Google Gemini.
Falls back to a simple keyword response when the API key is not configured.
"""
import os
from flask import request
from utils.response_helper import success_response, error_response

SYSTEM_PROMPT = """You are AgriBot, an expert agricultural assistant embedded in the
Agriculture Expert System web application. You help farmers, students, and researchers.

You can answer questions about:
- Crop selection (wheat, rice, maize, cotton, soybean, potato, sugarcane, tomato,
  onion, banana, groundnut, sunflower, pearl millet, chickpea, barley, mustard, jute,
  sorghum, lentil, watermelon, cucumber, brinjal)
- Fertilizer recommendations (NPK, Urea, DAP, MOP, gypsum, micronutrients)
- Pest and disease management (IPM, fungicides, insecticides, bio-control)
- Irrigation methods (drip, sprinkler, flood, furrow) and water requirements
- Soil types (clay, loamy, sandy, silt, black/regur) and soil pH management
- Seasons: Kharif (Jun-Oct), Rabi (Nov-Mar), Zaid (Apr-Jun)
- Organic farming, composting, biofertilizers
- This system's features:
    * Expert System: 25+ IF-THEN rules → crop + fertilizer + pest recommendation
    * ML Prediction: Decision Tree Regressor (98.7% accuracy) → yield in tons/hectare
    * Simulation: Live environmental parameter generation (temperature, humidity, rainfall)
    * History: Prediction log with CSV export
    * Admin Panel: CRUD rules and users (admin role only)

Keep answers concise, practical, and farmer-friendly. Use simple English.
Include specific numbers where helpful (kg/ha dosages, yield ranges, pH levels).
If asked something outside agriculture or this system, politely redirect to agriculture topics."""


def _fallback_response(message: str) -> str:
    """Simple keyword fallback when Gemini API key is not configured."""
    msg = message.lower()
    if any(k in msg for k in ["hello", "hi", "hey"]):
        return "Hello! I'm AgriBot. Ask me about crops, soil, fertilizers, or how to use this system."
    if any(k in msg for k in ["soil", "ph", "clay", "loamy", "sandy"]):
        return "The 5 main soil types are: Clay (good for rice), Loamy (best all-round), Sandy (fast draining, good for groundnut), Silt (fertile), Black/Regur (good for cotton, soybean). Ideal soil pH for most crops is 6.0-7.0."
    if any(k in msg for k in ["kharif", "rabi", "zaid", "season"]):
        return "Kharif crops (Jun-Oct): Rice, Maize, Cotton, Soybean, Groundnut, Sugarcane.\nRabi crops (Nov-Mar): Wheat, Barley, Mustard, Chickpea, Potato, Onion.\nZaid crops (Apr-Jun): Tomato, Sunflower, Watermelon, Cucumber."
    if any(k in msg for k in ["fertilizer", "npk", "urea", "dap"]):
        return "Common fertilizers: Urea (46% N) for leafy growth, DAP (18N:46P) as starter, MOP for root/fruit development, NPK 19:19:19 for balanced nutrition. Always base application on soil test results."
    if any(k in msg for k in ["wheat"]):
        return "Wheat: Rabi crop, best in loamy/sandy loam soil, needs 450-650mm water, 4-6 tons/ha yield. Apply DAP at sowing + Urea top-dress at tillering. Sow October-November."
    if any(k in msg for k in ["rice", "paddy"]):
        return "Rice: Kharif crop, clay soil, needs 1200-1500mm water, 4-6 tons/ha yield. Maintain 5cm standing water at tillering. Use N:120 P:60 K:60 kg/ha."
    if any(k in msg for k in ["expert system", "rules", "inference"]):
        return "The Expert System uses 25+ IF-THEN rules. Input your Soil Type + Weather + Season to get crop recommendation, fertilizer schedule, pest control advice, and yield expectation."
    if any(k in msg for k in ["ml", "machine learning", "prediction", "yield"]):
        return "The ML Prediction module uses a Decision Tree Regressor (98.7% test accuracy). Input soil pH, NPK values, temperature, and rainfall to predict crop yield in tons/hectare."
    return "I can help with crop selection, fertilizers, pest control, irrigation, and how to use this system. What would you like to know?"


def chat():
    """POST /api/chat — send a message and get an AI response."""
    data    = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    history = data.get("history", [])

    if not message:
        return error_response("Message is required", 400)

    api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key:
        return success_response(data={"reply": _fallback_response(message), "source": "fallback"})

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest",
            system_instruction=SYSTEM_PROMPT,
        )

        # Convert history to Gemini format (role must be "user" or "model")
        gemini_history = []
        for msg in history[-10:]:
            role = msg.get("role")
            content = msg.get("content", "")
            if role == "user" and content:
                gemini_history.append({"role": "user",  "parts": [content]})
            elif role == "assistant" and content:
                gemini_history.append({"role": "model", "parts": [content]})

        chat_session = model.start_chat(history=gemini_history)
        response = chat_session.send_message(message)
        reply = response.text
        return success_response(data={"reply": reply, "source": "llm"})

    except Exception as e:
        # Temporarily expose error for debugging
        return success_response(data={"reply": f"[DEBUG] {str(e)}", "source": "error"})
