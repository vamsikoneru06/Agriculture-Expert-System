"""Chat routes — LLM agricultural assistant."""
from flask import Blueprint
from controllers.chat_controller import chat

chat_bp = Blueprint("chat", __name__)

chat_bp.route("/api/chat", methods=["POST"])(chat)
