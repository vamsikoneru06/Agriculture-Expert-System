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

const WELCOME = {
  role: 'bot',
  text: "Hello! I'm AgriBot, your AI-powered agriculture assistant.\n\nI can answer any question about:\n- Crop selection & growing seasons\n- Soil types, pH & fertilizers\n- Pest control & irrigation\n- How to use this system\n\nWhat would you like to know?",
  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 mb-4 fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto shadow-lg shadow-green-900/40">
          AI
        </div>
      )}
      <div className={`max-w-xs lg:max-w-sm xl:max-w-md rounded-2xl px-4 py-3 text-sm whitespace-pre-line
        ${isUser
          ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-sm shadow-lg shadow-green-900/30'
          : 'bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-bl-sm'}`}>
        {msg.text}
        <p className={`text-xs mt-1.5 ${isUser ? 'text-green-200/70 text-right' : 'text-slate-500'}`}>{msg.time}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-white/[0.08] border border-white/[0.1] rounded-full flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0 mt-auto">
          You
        </div>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef  = useRef(null);
  const llmHistory = useRef([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text: userText, time }]);
    setTyping(true);
    llmHistory.current.push({ role: 'user', content: userText });

    try {
      const res = await api.post('/chat', { message: userText, history: llmHistory.current.slice(-10) });
      const reply = res.data?.data?.reply || "I'm having trouble connecting. Please try again.";
      llmHistory.current.push({ role: 'assistant', content: reply });
      setTyping(false);
      setMessages(m => [...m, { role: 'bot', text: reply, time }]);
    } catch (err) {
      setTyping(false);
      const detail = err?.response?.data?.message || err?.message || 'unknown error';
      setMessages(m => [...m, { role: 'bot', text: `Unable to reach AgriBot (${detail}). Check that REACT_APP_API_URL is set correctly.`, time }]);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleReset   = () => { setMessages([WELCOME]); setInput(''); llmHistory.current = []; };

  return (
    <div className="space-y-4 fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">AI Agriculture Chatbot</h2>
          <p className="text-slate-500 text-sm mt-0.5">Powered by Claude AI — ask anything about crops, soil, or this system</p>
        </div>
        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium">
          <MdRefresh size={18} /> New Chat
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)}
            className="text-xs px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5 rounded-full transition-all">
            {s}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '450px' }}>
        {/* Chat header bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-950/60 to-emerald-950/40 border-b border-white/[0.06] flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-900/40">
            AI
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AgriBot</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Powered by Claude AI
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
          {typing && (
            <div className="flex gap-3 mb-4 fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto">AI</div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02] flex-shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about agriculture…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 transition-all text-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="px-4 rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg shadow-green-900/30">
              <MdSend size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">Press Enter to send • AI responses may vary</p>
        </div>
      </div>
    </div>
  );
}
