import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, RefreshCw, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import HeroWave from '../components/ui/HeroWave';

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
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto shadow-md shadow-green-500/25">
          AI
        </div>
      )}
      <div className={`max-w-xs lg:max-w-sm xl:max-w-md rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed
        ${isUser
          ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-sm shadow-md shadow-green-500/20'
          : 'bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 rounded-bl-sm'
        }`}>
        {msg.text}
        <p className={`text-xs mt-1.5 ${isUser ? 'text-green-200/80 text-right' : 'text-slate-400 dark:text-slate-500'}`}>{msg.time}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-slate-200 dark:bg-white/[0.08] border border-slate-300 dark:border-white/[0.1] rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-bold flex-shrink-0 mt-auto">
          You
        </div>
      )}
    </div>
  );
}

export default function Chatbot() {
  const { dark }                           = useTheme();
  const [messages,  setMessages]           = useState([WELCOME]);
  const [input,     setInput]              = useState('');
  const [typing,    setTyping]             = useState(false);
  const [chatMode,  setChatMode]           = useState(false);
  const bottomRef                          = useRef(null);
  const inputRef                           = useRef(null);
  const llmHistory                         = useRef([]);

  useEffect(() => {
    if (chatMode) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, chatMode]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    setChatMode(true);

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
  }, [input]);

  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleReset   = () => { setMessages([WELCOME]); setInput(''); setChatMode(false); llmHistory.current = []; };

  /* ── HERO LANDING VIEW ── */
  if (!chatMode) {
    return (
      <div className="relative h-full w-full rounded-2xl overflow-hidden" style={{ minHeight: '550px' }}>
        {/* Light mode overlay on canvas */}
        {!dark && <div className="absolute inset-0 bg-slate-50/90 z-[1] pointer-events-none" />}
        <HeroWave
          title="AgriBot AI Assistant"
          subtitle="Powered by Gemini AI — ask anything about crops, soil, fertilizers & more"
          onPromptSubmit={sendMessage}
        />
      </div>
    );
  }

  /* ── CHAT VIEW ── */
  return (
    <div className="space-y-4 fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleReset}
            className="p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all shadow-sm"
            title="Back to home">
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Agriculture Chatbot</h2>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">Powered by Gemini AI — ask anything about crops, soil, or this system</p>
          </div>
        </div>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-4 h-9 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all text-sm font-semibold shadow-sm">
          <RefreshCw size={15} /> New Chat
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => sendMessage(s)}
            className="text-xs px-3 py-1.5 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-500/30 hover:bg-green-50 dark:hover:bg-green-500/5 rounded-full transition-all font-medium shadow-sm">
            {s}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-sm" style={{ minHeight: '450px' }}>
        {/* Chat header bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-950/60 dark:to-emerald-950/40 border-b border-green-500/20 dark:border-white/[0.06] flex-shrink-0">
          <div className="w-9 h-9 bg-white/20 dark:bg-gradient-to-br dark:from-green-500 dark:to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            AI
          </div>
          <div>
            <p className="font-bold text-white text-sm">AgriBot</p>
            <div className="flex items-center gap-1.5 text-xs text-green-200 dark:text-slate-400">
              <span className="w-1.5 h-1.5 bg-white dark:bg-green-400 rounded-full animate-pulse" />
              Powered by Gemini AI
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-5 bg-slate-50/50 dark:bg-transparent"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        >
          {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
          {typing && (
            <div className="flex gap-3 mb-4 fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto shadow-md shadow-green-500/25">AI</div>
              <div className="bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about agriculture…"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 dark:focus:border-green-500/40 transition-all text-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="px-4 rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-md shadow-green-500/20">
              <Send size={17} />
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 text-center">Press Enter to send • AI responses may vary</p>
        </div>
      </div>
    </div>
  );
}
