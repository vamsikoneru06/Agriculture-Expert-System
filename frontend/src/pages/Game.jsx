import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy, Star, Zap, RotateCcw, Timer,
  Flame, Target, CheckCircle2, XCircle, Sprout,
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const CROP_MAP = {
  rainy: { kharif: 'Rice / Jute',  rabi: 'Barley',   zaid: 'Cucumber'   },
  humid: { kharif: 'Rice',         rabi: 'Mustard',  zaid: 'Brinjal'    },
  hot:   { kharif: 'Cotton',       rabi: 'Wheat',    zaid: 'Tomato'     },
  dry:   { kharif: 'Pearl Millet', rabi: 'Wheat',    zaid: 'Sunflower'  },
  cool:  { kharif: 'Maize',        rabi: 'Potato',   zaid: 'Watermelon' },
};

const ALL_CROPS = [...new Set(
  Object.values(CROP_MAP).flatMap(s => Object.values(s))
)];

const CROP_EMOJI = {
  'Rice / Jute':  '🌾', 'Rice': '🍚',  'Barley': '🌿',
  'Cucumber':     '🥒', 'Mustard': '🌼', 'Brinjal': '🍆',
  'Cotton':       '🌸', 'Wheat': '🌾', 'Tomato': '🍅',
  'Pearl Millet': '🌾', 'Sunflower': '🌻', 'Maize': '🌽',
  'Potato':       '🥔', 'Watermelon': '🍉',
};

const SOIL_EMOJI    = { sandy:'🏜️', clay:'🟤', loamy:'🌿', black:'⚫', silt:'💧' };
const WEATHER_EMOJI = { rainy:'🌧️', humid:'💦', hot:'🌡️', dry:'☀️', cool:'❄️' };
const SEASON_EMOJI  = { kharif:'🌾', rabi:'🌿', zaid:'🌱' };
const SEASON_MONTHS = { kharif:'Jun–Oct', rabi:'Nov–Mar', zaid:'Apr–Jun' };

const DIFFICULTY = {
  easy:   { label:'Easy',   time:12, color:'#4ade80', textColor:'#166534', desc:'12 sec · relaxed pace'  },
  medium: { label:'Medium', time: 8, color:'#fbbf24', textColor:'#92400e', desc:'8 sec · standard pace'  },
  hard:   { label:'Hard',   time: 5, color:'#f87171', textColor:'#991b1b', desc:'5 sec · fast pace'      },
};

const GRADES = [
  { min:90, label:'S', color:'#fbbf24', bg:'rgba(251,191,36,0.15)',  msg:'Legendary Farmer! 🏆'     },
  { min:75, label:'A', color:'#4ade80', bg:'rgba(74,222,128,0.12)',  msg:'Expert Agronomist! 🌾'    },
  { min:55, label:'B', color:'#60a5fa', bg:'rgba(96,165,250,0.12)',  msg:'Good Knowledge! 🌿'       },
  { min: 0, label:'C', color:'#f87171', bg:'rgba(248,113,113,0.12)', msg:'Keep Practicing! 💪'     },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function makeScenario() {
  const soils    = ['sandy', 'clay', 'loamy', 'black', 'silt'];
  const weathers = ['rainy', 'humid', 'hot', 'dry', 'cool'];
  const seasons  = ['kharif', 'rabi', 'zaid'];

  const weather = weathers[Math.floor(Math.random() * weathers.length)];
  const season  = seasons[Math.floor(Math.random() * seasons.length)];
  const soil    = soils[Math.floor(Math.random() * soils.length)];
  const answer  = CROP_MAP[weather][season];

  const pool        = ALL_CROPS.filter(c => c !== answer);
  const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const options     = [...distractors, answer].sort(() => Math.random() - 0.5);

  return { soil, weather, season, answer, options };
}

function calcPoints(timeLeft, maxTime, streak) {
  const base  = 100;
  const speed = Math.round((timeLeft / maxTime) * 50);
  const multi = streak >= 7 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
  return Math.round((base + speed) * multi);
}

function getGrade(pct) {
  return GRADES.find(g => pct >= g.min) || GRADES[GRADES.length - 1];
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */

/* Circular timer ring */
function TimerRing({ timeLeft, maxTime, color }) {
  const r    = 24;
  const circ = 2 * Math.PI * r;
  const pct  = timeLeft / maxTime;
  const dash = circ * pct;
  const warn = pct < 0.35;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="-rotate-90 absolute inset-0 w-full h-full">
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4"
          stroke="rgba(0,0,0,0.08)" className="dark:[stroke:rgba(255,255,255,0.08)]" />
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4"
          stroke={warn ? '#f87171' : color}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.9s linear', filter: `drop-shadow(0 0 3px ${warn ? '#f87171' : color}80)` }} />
      </svg>
      <span className={`font-data font-bold text-lg tabular-nums z-10 ${warn ? 'text-red-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
        {timeLeft}
      </span>
    </div>
  );
}

/* Answer option button */
function OptionBtn({ crop, selected, correct, answered, onChoose, dark }) {
  const isSelected = selected === crop;
  const isCorrect  = correct  === crop;

  let bg, border, text, glow;
  if (answered) {
    if (isSelected && isCorrect) {
      bg = 'rgba(74,222,128,0.15)'; border = '#4ade80'; text = '#4ade80'; glow = '0 0 16px rgba(74,222,128,0.4)';
    } else if (isSelected && !isCorrect) {
      bg = 'rgba(248,113,113,0.15)'; border = '#f87171'; text = '#f87171'; glow = 'none';
    } else if (!isSelected && isCorrect) {
      bg = 'rgba(74,222,128,0.08)'; border = '#4ade80'; text = dark ? '#d0e8d0' : '#166534'; glow = 'none';
    } else {
      bg = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'; border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'; text = dark ? 'rgba(180,210,180,0.3)' : 'rgba(15,47,15,0.3)'; glow = 'none';
    }
  } else {
    bg = dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)';
    border = dark ? 'rgba(74,222,128,0.12)' : 'rgba(34,139,34,0.18)';
    text = dark ? 'rgba(208,232,208,0.9)' : '#1a3e1a';
    glow = 'none';
  }

  const emoji = CROP_EMOJI[crop] || '🌱';

  return (
    <button
      onClick={() => !answered && onChoose(crop)}
      disabled={answered}
      className="w-full rounded-xl px-4 py-3.5 text-left flex items-center gap-3 font-semibold text-[13px] transition-all duration-200"
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        color: text,
        boxShadow: glow,
        cursor: answered ? 'default' : 'pointer',
      }}
      onMouseEnter={e => { if (!answered) { e.currentTarget.style.border = `1.5px solid ${dark ? 'rgba(74,222,128,0.35)' : 'rgba(34,139,34,0.4)'}`;  e.currentTarget.style.background = dark ? 'rgba(74,222,128,0.07)' : 'rgba(22,163,74,0.06)'; } }}
      onMouseLeave={e => { if (!answered) { e.currentTarget.style.border = `1.5px solid ${border}`; e.currentTarget.style.background = bg; } }}>
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <span className="leading-tight">{crop}</span>
      {answered && isCorrect && <CheckCircle2 size={14} className="ml-auto flex-shrink-0 text-green-400" />}
      {answered && isSelected && !isCorrect && <XCircle size={14} className="ml-auto flex-shrink-0 text-red-400" />}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Game() {
  const { dark } = useTheme();

  /* ── Config ── */
  const [difficulty,  setDifficulty]  = useState('medium');
  const [totalRounds, setTotalRounds] = useState(10);

  /* ── Game state ── */
  const [phase,      setPhase]      = useState('landing');   // landing | playing | feedback | results
  const [round,      setRound]      = useState(0);
  const [score,      setScore]      = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(8);
  const [scenario,   setScenario]   = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [lastCorrect,setLastCorrect]= useState(false);
  const [lastPts,    setLastPts]    = useState(0);
  const [history,    setHistory]    = useState([]);          // [{correct,pts}]

  /* ── High score (localStorage) ── */
  const [hiScore, setHiScore] = useState(() => {
    try { return parseInt(localStorage.getItem('agri_game_hi') || '0', 10); }
    catch { return 0; }
  });

  const timerRef   = useRef(null);
  const answeredRef= useRef(false);
  const maxTime    = DIFFICULTY[difficulty].time;
  const diffColor  = DIFFICULTY[difficulty].color;

  /* ── Timer countdown ── */
  useEffect(() => {
    if (phase !== 'playing') return;
    answeredRef.current = false;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, round]);

  /* ── Timeout trigger ── */
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      handleAnswer(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  /* ── Answer handler ── */
  function handleAnswer(choice) {
    if (answeredRef.current || phase !== 'playing') return;
    answeredRef.current = true;
    clearInterval(timerRef.current);

    const correct    = choice !== null && choice === scenario.answer;
    const earned     = correct ? calcPoints(timeLeft, maxTime, streak) : 0;
    const newStreak  = correct ? streak + 1 : 0;
    const newBest    = Math.max(bestStreak, newStreak);
    const newScore   = score + earned;
    const newHistory = [...history, { correct, pts: earned }];

    setSelected(choice);
    setLastCorrect(correct);
    setLastPts(earned);
    setScore(newScore);
    setStreak(newStreak);
    setBestStreak(newBest);
    setHistory(newHistory);
    setPhase('feedback');

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= totalRounds) {
        /* Save high score */
        if (newScore > hiScore) {
          setHiScore(newScore);
          try { localStorage.setItem('agri_game_hi', String(newScore)); } catch { /* ignore */ }
        }
        setPhase('results');
      } else {
        setRound(nextRound);
        setScenario(makeScenario());
        setTimeLeft(maxTime);
        setSelected(null);
        setPhase('playing');
      }
    }, 1500);
  }

  function startGame() {
    setRound(0); setScore(0); setStreak(0); setBestStreak(0);
    setHistory([]); setSelected(null);
    setScenario(makeScenario());
    setTimeLeft(maxTime);
    setPhase('playing');
  }

  function restartGame() {
    setPhase('landing');
  }

  /* ── Derived ── */
  const accuracy = history.length ? Math.round((history.filter(h => h.correct).length / history.length) * 100) : 0;
  const isNewHi     = score > 0 && score >= hiScore && phase === 'results';

  /* ══════════════════ T (theme tokens) ══════════════════ */
  const T = {
    page:      dark ? 'rgba(255,255,255,0.02)'    : 'rgba(255,255,255,0.9)',
    card:      dark ? 'rgba(255,255,255,0.03)'    : 'rgba(255,255,255,0.92)',
    border:    dark ? 'rgba(74,222,128,0.1)'      : 'rgba(34,139,34,0.15)',
    title:     dark ? '#d0e8d0'                   : '#0f2f0f',
    sub:       dark ? 'rgba(180,210,180,0.55)'    : 'rgba(15,47,15,0.6)',
    accent:    dark ? 'rgba(74,222,128,0.45)'     : 'rgba(22,101,52,0.65)',
    divider:   dark ? 'rgba(74,222,128,0.07)'     : 'rgba(34,139,34,0.1)',
    pillBase:  dark ? 'rgba(255,255,255,0.04)'    : 'rgba(255,255,255,0.7)',
    pillBdr:   dark ? 'rgba(74,222,128,0.12)'     : 'rgba(34,139,34,0.2)',
  };

  /* ══════════════════════════════════════════
     PHASE: LANDING
  ══════════════════════════════════════════ */
  if (phase === 'landing') return (
    <div className="max-w-lg mx-auto space-y-5 fade-in">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-7 text-center"
        style={{ background: 'linear-gradient(135deg,#166534 0%,#15803d 50%,#0e7490 100%)', border: '1px solid rgba(74,222,128,0.2)' }}>
        <div className="absolute inset-0 bg-crop-rows opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="text-6xl mb-3">🌾</div>
          <h1 className="font-display text-3xl font-black text-white mb-2">Crop Master</h1>
          <p className="text-green-200 text-[13px] leading-relaxed">
            Guess the right crop for the given soil, weather &amp; season conditions.<br />
            Race against the clock and build your streak!
          </p>
          {hiScore > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Trophy size={12} className="text-yellow-300" />
              <span className="text-[11px] font-bold text-yellow-200">Best Score: {hiScore}</span>
            </div>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div className="rounded-2xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: T.accent }}>Difficulty</p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DIFFICULTY).map(([key, d]) => (
            <button key={key} onClick={() => setDifficulty(key)}
              className="rounded-xl p-3 text-center transition-all font-semibold"
              style={{
                background:  difficulty === key ? `${d.color}18` : T.pillBase,
                border:      `1.5px solid ${difficulty === key ? d.color : T.pillBdr}`,
                color:       difficulty === key ? d.color : T.sub,
                boxShadow:   difficulty === key ? `0 0 12px ${d.color}30` : 'none',
              }}>
              <p className="text-[13px] font-bold">{d.label}</p>
              <p className="text-[9px] mt-0.5 opacity-70">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Rounds */}
      <div className="rounded-2xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: T.accent }}>Rounds</p>
        <div className="flex gap-2">
          {[5, 10, 15].map(n => (
            <button key={n} onClick={() => setTotalRounds(n)}
              className="flex-1 py-2.5 rounded-xl font-bold text-[14px] transition-all"
              style={{
                background: totalRounds === n ? `${diffColor}18` : T.pillBase,
                border:     `1.5px solid ${totalRounds === n ? diffColor : T.pillBdr}`,
                color:      totalRounds === n ? diffColor : T.sub,
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* How to play */}
      <div className="rounded-2xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: T.accent }}>How to Play</p>
        <div className="space-y-2">
          {[
            ['🌿', 'You are shown soil type, weather and season'],
            ['🎯', 'Pick the correct crop from 4 options'],
            ['⚡', 'Faster answers earn more speed bonus points'],
            ['🔥', 'Build a streak for a score multiplier (1.5× → 3×)'],
          ].map(([em, txt]) => (
            <div key={txt} className="flex items-center gap-2.5 text-[12px]" style={{ color: T.sub }}>
              <span className="text-base flex-shrink-0">{em}</span> {txt}
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button onClick={startGame}
        className="w-full py-4 rounded-2xl font-display font-black text-[16px] text-white transition-all shadow-glow-sm"
        style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', letterSpacing: '0.04em' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
        🚀 Start Game
      </button>
    </div>
  );

  /* ══════════════════════════════════════════
     PHASE: PLAYING / FEEDBACK
  ══════════════════════════════════════════ */
  if (phase === 'playing' || phase === 'feedback') {
    const answered = phase === 'feedback';
    return (
      <div className="max-w-lg mx-auto space-y-4 fade-in">

        {/* Top bar: progress + score + streak */}
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold mb-1.5" style={{ color: T.accent }}>
              <span>Round {round + 1} of {totalRounds}</span>
              <span className="font-data">{score} pts</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.divider }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((round) / totalRounds) * 100}%`, background: diffColor, boxShadow: `0 0 6px ${diffColor}60` }} />
            </div>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-[12px]"
              style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)', color: '#fb923c' }}>
              <Flame size={12} className="animate-pulse" /> {streak}×
            </div>
          )}
        </div>

        {/* Timer + Conditions card */}
        <div className="rounded-2xl p-5" style={{ background: T.card, border: `1.5px solid ${T.border}` }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: T.accent }}>
                What crop should be grown?
              </p>
              <p className="text-[12px]" style={{ color: T.sub }}>Choose the best crop for these conditions</p>
            </div>
            <TimerRing timeLeft={timeLeft} maxTime={maxTime} color={diffColor} />
          </div>

          {/* Condition pills */}
          {scenario && (
            <div className="flex flex-wrap gap-2">
              {[
                { label:'Soil',    val: scenario.soil,    emoji: SOIL_EMOJI[scenario.soil]    },
                { label:'Weather', val: scenario.weather, emoji: WEATHER_EMOJI[scenario.weather] },
                { label:'Season',  val: scenario.season,  emoji: SEASON_EMOJI[scenario.season],  sub: SEASON_MONTHS[scenario.season] },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: dark ? 'rgba(74,222,128,0.06)' : 'rgba(22,163,74,0.07)', border: `1px solid ${T.divider}` }}>
                  <span className="text-base">{c.emoji}</span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: T.accent }}>{c.label}</p>
                    <p className="text-[12px] font-bold capitalize leading-tight" style={{ color: T.title }}>{c.val}</p>
                    {c.sub && <p className="text-[9px]" style={{ color: T.sub }}>{c.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points flash */}
        {answered && lastPts > 0 && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-data font-bold text-[14px]"
              style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Zap size={14} /> +{lastPts} pts {streak > 1 ? `· ${streak}× streak! 🔥` : ''}
            </span>
          </div>
        )}
        {answered && !lastCorrect && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-[13px]"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              {selected === null ? '⏰ Time\'s up!' : '❌ Wrong!'} — Correct: {scenario?.answer}
            </span>
          </div>
        )}

        {/* Answer options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {scenario?.options.map(crop => (
            <OptionBtn key={crop} crop={crop}
              selected={selected}
              correct={scenario.answer}
              answered={answered}
              onChoose={handleAnswer}
              dark={dark} />
          ))}
        </div>

        {/* Bottom stats */}
        <div className="flex justify-center gap-6 py-1">
          {[
            { icon: Target,  label: 'Accuracy', val: history.length ? `${Math.round((history.filter(h=>h.correct).length/history.length)*100)}%` : '—' },
            { icon: Trophy,  label: 'Best Streak', val: bestStreak || '—' },
            { icon: Timer,   label: 'Speed',     val: DIFFICULTY[difficulty].label },
          ].map(s => (
            <div key={s.label} className="text-center">
              <s.icon size={12} style={{ color: T.accent, margin: '0 auto 2px' }} />
              <p className="font-data font-bold text-[12px]" style={{ color: T.title }}>{s.val}</p>
              <p className="text-[9px]" style={{ color: T.sub }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     PHASE: RESULTS
  ══════════════════════════════════════════ */
  if (phase === 'results') {
    const correct = history.filter(h => h.correct).length;
    const gradeInfo = getGrade(accuracy);

    return (
      <div className="max-w-lg mx-auto space-y-4 fade-in">

        {/* Hero result card */}
        <div className="relative overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(135deg,#0f2f0f 0%,#0e7490 100%)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <div className="absolute inset-0 bg-crop-rows opacity-20 pointer-events-none" />
          <div className="relative z-10 p-6 text-center">
            {/* Grade badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 font-display font-black text-4xl"
              style={{ background: gradeInfo.bg, border: `3px solid ${gradeInfo.color}`, color: gradeInfo.color, boxShadow: `0 0 30px ${gradeInfo.color}40` }}>
              {gradeInfo.label}
            </div>
            <p className="text-white font-bold text-lg mb-0.5">{gradeInfo.msg}</p>
            <p className="text-green-200 text-[12px]">{DIFFICULTY[difficulty].label} · {totalRounds} rounds</p>

            {/* Score */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <p className="font-data font-black text-5xl tabular-nums" style={{ color: gradeInfo.color }}>{score}</p>
              <div className="text-left">
                <p className="text-[10px] text-green-300 font-bold uppercase">points</p>
                {isNewHi && <p className="text-[10px] text-yellow-300 font-bold">🏆 New Best!</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: 'Correct',     val: `${correct}/${totalRounds}`, color: '#4ade80' },
            { icon: Target,       label: 'Accuracy',    val: `${accuracy}%`,              color: '#60a5fa' },
            { icon: Flame,        label: 'Best Streak', val: bestStreak,                  color: '#fb923c' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: T.card, border: `1px solid ${T.border}` }}>
              <s.icon size={16} style={{ color: s.color, margin: '0 auto 6px' }} />
              <p className="font-data font-bold text-xl tabular-nums" style={{ color: s.color }}>{s.val}</p>
              <p className="text-[10px] mt-0.5" style={{ color: T.sub }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Round-by-round history */}
        <div className="rounded-2xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: T.accent }}>Round Breakdown</p>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <div key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-data"
                style={{
                  background: h.correct ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.12)',
                  border:     `1px solid ${h.correct ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.25)'}`,
                  color:      h.correct ? '#4ade80' : '#f87171',
                }}
                title={`Round ${i+1}: ${h.correct ? '+'+h.pts+' pts' : 'Wrong'}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: T.sub }}>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400/40 inline-block" />Correct</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400/40 inline-block" />Wrong</span>
            <span className="ml-auto font-data">Hi-Score: <b style={{ color: T.title }}>{hiScore}</b></span>
          </div>
        </div>

        {/* High score compare */}
        {!isNewHi && hiScore > 0 && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <Star size={14} className="text-yellow-400 flex-shrink-0" />
            <p className="text-[12px]" style={{ color: T.sub }}>
              You need <b style={{ color: '#fbbf24' }}>{hiScore - score} more pts</b> to beat your best score of <b style={{ color: '#fbbf24' }}>{hiScore}</b>
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={startGame}
            className="flex-1 py-3.5 rounded-xl font-bold text-white text-[13px] transition-all"
            style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            <Zap size={13} className="inline mr-1.5 mb-0.5" />Play Again
          </button>
          <button onClick={restartGame}
            className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl font-bold text-[13px] transition-all"
            style={{ background: T.card, border: `1px solid ${T.border}`, color: T.sub }}
            onMouseEnter={e => { e.currentTarget.style.color = T.title; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.sub; }}>
            <RotateCcw size={13} /> Menu
          </button>
        </div>

        {/* Fun fact */}
        <div className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <Sprout size={14} style={{ color: dark ? '#4ade80' : '#15803d', flexShrink: 0 }} />
          <p className="text-[11px]" style={{ color: T.sub }}>
            <b style={{ color: T.title }}>Did you know?</b> India grows 127 different types of crops across Kharif, Rabi and Zaid seasons, feeding over 1.4 billion people.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
