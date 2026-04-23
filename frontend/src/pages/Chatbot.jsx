import React, { useState, useEffect, useRef } from 'react';
import { MdSend, MdChat, MdRefresh } from 'react-icons/md';

/* ── FAQ Knowledge Base ── */
const FAQ = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste'],
    answer: 'Hello! 👋 I\'m AgriBot, your smart agriculture assistant. Ask me anything about crops, soil, fertilizers, or weather!',
  },
  {
    keywords: ['soil', 'types of soil', 'best soil'],
    answer: '🌍 There are 5 main soil types in Indian agriculture:\n• **Sandy** – drains fast, best for millets & groundnut\n• **Clay** – retains water, ideal for rice\n• **Loamy** – best all-round soil for wheat, maize, cotton\n• **Black (Regur)** – excellent for cotton & soybean\n• **Silt** – fertile, good for sugarcane & jute',
  },
  {
    keywords: ['kharif', 'kharif crops', 'summer crops'],
    answer: '☀️ **Kharif crops** (Jun–Oct, rainy season):\nRice, Maize, Cotton, Soybean, Groundnut, Jowar, Bajra, Jute\n\nKey condition: They need monsoon rains to germinate.',
  },
  {
    keywords: ['rabi', 'rabi crops', 'winter crops'],
    answer: '❄️ **Rabi crops** (Nov–Mar, winter season):\nWheat, Barley, Mustard, Chickpea, Lentil, Potato, Onion\n\nKey condition: Cool temperatures and less water needed.',
  },
  {
    keywords: ['zaid', 'summer crops', 'zaid crops'],
    answer: '🌞 **Zaid crops** (Apr–Jun, summer):\nWatermelon, Cucumber, Brinjal, Tomato, Sunflower, Bitter Gourd\n\nKey condition: Short-duration, warm weather crops.',
  },
  {
    keywords: ['fertilizer', 'npk', 'urea', 'dap'],
    answer: '🌱 **Common fertilizers:**\n• **Urea (46% N)** – Nitrogen booster, for leafy growth\n• **DAP (18%N, 46%P)** – Starter fertilizer at sowing\n• **MOP** – Potassium for root/fruit development\n• **NPK 19:19:19** – Balanced, all stages\n\nAlways apply based on soil test results!',
  },
  {
    keywords: ['pest', 'insects', 'disease', 'fungus'],
    answer: '🐛 **Pest & Disease Management:**\n• Use **IPM** (Integrated Pest Management)\n• Neem spray works for most soft-bodied insects\n• Mancozeb / Carbendazim for fungal diseases\n• Pheromone traps for bollworm/fruit fly\n• Always apply in early morning or evening',
  },
  {
    keywords: ['wheat', 'wheat crop'],
    answer: '🌿 **Wheat Cultivation Tips:**\n• Best soil: Loamy or sandy loam\n• Season: Rabi (Oct–Nov sowing)\n• Water: 4-5 irrigations (CRI, tillering, flowering)\n• Fertilizer: DAP 75 kg/acre + Urea top-dress\n• Expected yield: 4-6 tons/hectare\n• Harvest: 120-150 days',
  },
  {
    keywords: ['rice', 'paddy', 'rice crop'],
    answer: '🍚 **Rice (Paddy) Tips:**\n• Best soil: Clay or clay-loam\n• Season: Kharif (Jun–Jul transplanting)\n• Water: 1200-1500mm; maintain 5cm standing water\n• Fertilizer: N:120 P:60 K:60 kg/ha\n• Major pest: Stem borer, BPH, blast\n• Yield: 4-6 tons/hectare',
  },
  {
    keywords: ['irrigation', 'water', 'watering'],
    answer: '💧 **Irrigation Methods:**\n• **Drip irrigation** – saves 50-60% water, ideal for horticulture\n• **Sprinkler** – for uneven terrain, vegetables\n• **Flood irrigation** – traditional, for rice fields\n• **Furrow** – row crops like cotton, sugarcane\n\nTip: Irrigate in early morning to reduce evaporation loss.',
  },
  {
    keywords: ['organic', 'organic farming', 'compost'],
    answer: '♻️ **Organic Farming:**\n• Use **FYM** (Farm Yard Manure) 10-15 tons/ha\n• Vermicompost is excellent – 3-5 tons/ha\n• Green manure crops: Sunhemp, Dhaincha\n• Bio-fertilizers: Rhizobium, Azotobacter, PSB\n• Organic farming fetches 20-30% premium price',
  },
  {
    keywords: ['ph', 'soil ph', 'acidity'],
    answer: '🧪 **Soil pH Guide:**\n• pH 6.0–7.0 = ideal for most crops\n• Below 6 (Acidic) → Apply lime (calcium carbonate)\n• Above 7.5 (Alkaline) → Apply gypsum or sulphur\n• Get soil tested every 2-3 years\n• Rice tolerates pH 5.5-6.5; wheat prefers 6-7',
  },
  {
    keywords: ['machine learning', 'ml', 'ai', 'prediction'],
    answer: '🤖 **ML Module in this system:**\n• Uses **Decision Tree Regressor** (scikit-learn)\n• Trained on 2,200 labelled crop yield samples\n• Features: Soil pH, NPK levels, temperature, rainfall\n• Train accuracy: 91.2% | Test accuracy: 88.7%\n• Go to the **ML Prediction** page to try it!',
  },
  {
    keywords: ['expert system', 'rules', 'inference'],
    answer: '📋 **Expert System Module:**\n• Uses **rule-based IF-THEN inference**\n• Knowledge base: 25+ expert rules\n• Input: Soil type + Weather + Season\n• Output: Crop + Fertilizer + Pest control\n• Rules are curated by agricultural domain experts\n• Try it on the **Expert System** page!',
  },
  {
    keywords: ['simulation', 'environment', 'weather simulation'],
    answer: '🌦️ **Simulation Module:**\n• Simulates temperature, humidity, rainfall, soil moisture\n• Updates every 1-3 seconds dynamically\n• Detects soil type & season automatically\n• Suggests suitable crops based on conditions\n• Try the **Simulation** page to see it live!',
  },
  {
    keywords: ['help', 'guide', 'how to use'],
    answer: '📖 **How to use AgriExpert:**\n1. **Expert System** → Enter soil/weather/season → get crop recommendation\n2. **Simulation** → Run live environmental simulation\n3. **ML Prediction** → Input farm parameters → get yield forecast\n4. **History** → View all your past predictions\n5. **Admin Panel** → Manage rules & users (admin only)\n\nNeed anything specific? Just ask!',
  },
];

function matchAnswer(input) {
  const lower = input.toLowerCase().trim();
  for (const faq of FAQ) {
    if (faq.keywords.some(kw => lower.includes(kw))) return faq.answer;
  }
  return "🌾 I didn't quite understand that. Try asking about:\n• Crops (wheat, rice, maize)\n• Soil types or fertilizers\n• Kharif / Rabi / Zaid seasons\n• Irrigation or pest control\n• How to use the Expert System";
}

const SUGGESTIONS = [
  'What are Kharif crops?',
  'Best fertilizer for wheat',
  'How does the Expert System work?',
  'Types of soil in agriculture',
  'Tips for organic farming',
  'What is ML Prediction?',
];

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2 mb-3 fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-auto">
          🤖
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
          👤
        </div>
      )}
    </div>
  );
}

const WELCOME = {
  role: 'bot',
  text: "👋 Hello! I'm **AgriBot**, your agriculture assistant.\n\nI can help you with:\n• Crop selection & seasons\n• Soil types & fertilizers\n• Pest control advice\n• How to use this system\n\nWhat would you like to know?",
  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    setMessages(m => [...m, { role: 'user', text: userText, time }]);
    setTyping(true);

    /* Simulate typing delay */
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));

    const answer = matchAnswer(userText);
    setTyping(false);
    setMessages(m => [...m, { role: 'bot', text: answer, time }]);
  };

  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const handleReset = () => { setMessages([WELCOME]); setInput(''); };

  return (
    <div className="space-y-4 fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">AI Agriculture Chatbot</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Ask questions about crops, soil, fertilizers, and this system
          </p>
        </div>
        <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
          <MdRefresh size={18} /> Reset Chat
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
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <p className="font-semibold text-sm">AgriBot</p>
            <div className="flex items-center gap-1.5 text-xs text-primary-200">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => <ChatMessage key={i} msg={msg} />)}
          {typing && (
            <div className="flex gap-2 mb-3 fade-in">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">🤖</div>
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
              placeholder="Ask about crops, soil, seasons…"
              className="flex-1 form-input py-2.5"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="btn-primary px-4 flex-shrink-0"
            >
              <MdSend size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 text-center">Press Enter to send • Ask anything about agriculture</p>
        </div>
      </div>
    </div>
  );
}
