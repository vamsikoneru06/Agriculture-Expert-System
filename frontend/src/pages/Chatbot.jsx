import React, { useState, useEffect, useRef } from 'react';
import { MdSend, MdRefresh } from 'react-icons/md';
import api from '../services/api';

const SUGGESTIONS = [
  'What crops grow in clay soil?',
  'Best fertilizer for wheat',
  'How does the Expert System work?',
  'Kharif vs Rabi seasons',
  'Tips for organic farming',
  'How to predict crop yield?',
  'Pest control for rice',
  'Ideal soil pH for maize',
];

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 mb-3 fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto">
          AI
        </div>
      )}
      <div className={`max-w-xs lg:max-w-sm xl:max-w-md rounded-2xl px-4 py-3 text-sm whitespace-pre-line
        ${isUser
          ? 'bg-primary-600 text-white rounded-br-sm'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm'
        }`}>
        {msg.text}
        <p className={`text-xs mt-1 ${isUser ? 'text-primary-200 text-right' : 'text-slate-400'}`}>
          {msg.time}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-200 text-xs font-bold flex-shrink-0 mt-auto">
          You
        </div>
      )}
    </div>
  );
}

const WELCOME = {
  role: 'bot',
  text: "Hello! I'm AgriBot, your AI-powered agriculture assistant.\n\nI can answer any question about:\n- Crop selection & growing seasons\n- Soil types, pH & fertilizers\n- Pest control & irrigation\n- How to use this system\n\nWhat would you like to know?",
  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef  = useRef(null);
  // llmHistory stores {role, content} pairs for the API conversation context
  const llmHistory = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text: userText, time }]);
    setTyping(true);

    // Add user message to LLM history
    llmHistory.current.push({ role: 'user', content: userText });

    try {
      const res = await api.post('/chat', {
        message: userText,
        history: llmHistory.current.slice(-10),
      });

      const reply = res.data?.data?.reply || "I'm having trouble connecting. Please try again.";
      llmHistory.current.push({ role: 'assistant', content: reply });

      setTyping(false);
      setMessages(m => [...m, { role: 'bot', text: reply, time }]);
    } catch (_) {
      setTyping(false);
      const fallback = "I'm currently offline. Please check your connection or try again shortly.";
      setMessages(m => [...m, { role: 'bot', text: fallback, time }]);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    setInput('');
    llmHistory.current = [];
  };

  return (
    <div className="space-y-4 fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">AI Agriculture Chatbot</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Powered by Claude AI — ask anything about crops, soil, or this system
          </p>
        </div>
        <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
          <MdRefresh size={18} /> New Chat
        </button>
      </div>

      {/* ── Suggested questions ── */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)}
            className="text-xs px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300
                       border border-primary-200 dark:border-primary-700 rounded-full hover:bg-primary-100 transition-colors">
            {s}
          </button>
        ))}
      </div>

      {/* ── Chat window ── */}
      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: '55vh' }}>
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-primary-600 text-white">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">AI</div>
          <div>
            <p className="font-semibold text-sm">AgriBot</p>
            <div className="flex items-center gap-1.5 text-xs text-primary-200">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Powered by Claude AI
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
          {typing && (
            <div className="flex gap-2 mb-3 fade-in">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AI</div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about agriculture…"
              className="flex-1 form-input py-2.5"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="btn-primary px-4 flex-shrink-0"
            >
              <MdSend size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 text-center">
            Press Enter to send • AI responses may vary
          </p>
        </div>
      </div>
    </div>
  );
}
