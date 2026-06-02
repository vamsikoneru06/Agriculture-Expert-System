import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ─── Shaders ─────────────────────────────────────────────────── */
const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uBarIndex;
  uniform float uTotalBars;
  attribute float aOffset;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    float normalizedIndex = uBarIndex / uTotalBars;
    float wave = sin(position.x * uFrequency + uTime + uBarIndex * 0.3) * uAmplitude;
    float wave2 = sin(position.x * uFrequency * 2.0 + uTime * 1.5 + uBarIndex * 0.5) * uAmplitude * 0.5;
    vec3 newPosition = position;
    newPosition.y += wave + wave2;
    vElevation = (wave + wave2) / (uAmplitude * 1.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    float mixStrength = (vElevation + 1.0) * 0.5;
    vec3 color = mix(uColorA, uColorB, mixStrength);
    float alpha = uOpacity * (0.6 + mixStrength * 0.4);
    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─── Bar configurations ──────────────────────────────────────── */
const BAR_CONFIGS = [
  { color: '#00ff88', glowColor: '#00ff88', width: 0.008, segments: 256, yOffset: 0.0,  speed: 1.0, amplitude: 0.25 },
  { color: '#00cc6a', glowColor: '#00cc6a', width: 0.006, segments: 256, yOffset: 0.05, speed: 1.3, amplitude: 0.2  },
  { color: '#00ff88', glowColor: '#00ff88', width: 0.004, segments: 256, yOffset: -0.05,speed: 0.8, amplitude: 0.15 },
  { color: '#00aa55', glowColor: '#00aa55', width: 0.003, segments: 200, yOffset: 0.08, speed: 1.5, amplitude: 0.18 },
  { color: '#33ffaa', glowColor: '#33ffaa', width: 0.003, segments: 200, yOffset: -0.08,speed: 1.1, amplitude: 0.12 },
  { color: '#00ff88', glowColor: '#00ff88', width: 0.002, segments: 150, yOffset: 0.12, speed: 1.7, amplitude: 0.1  },
  { color: '#00dd77', glowColor: '#00dd77', width: 0.002, segments: 150, yOffset: -0.12,speed: 0.9, amplitude: 0.08 },
];

/* ─── Typing placeholder ──────────────────────────────────────── */
const PLACEHOLDER_PHRASES = [
  'Ask about crop recommendations…',
  'What grows best in clay soil?',
  'Fertilizer advice for wheat…',
  'Pest control for rice crops…',
  'Best season to grow maize…',
  'Irrigation tips for dry weather…',
];

/* ─── Main Component ──────────────────────────────────────────── */
export default function HeroWave({
  title = 'AgriBot AI Assistant',
  subtitle = 'Powered by Gemini AI — ask anything about crops, soil & more',
  onPromptSubmit,
}) {
  const canvasRef     = useRef(null);
  const textareaRef   = useRef(null);
  const rendererRef   = useRef(null);
  const sceneRef      = useRef(null);
  const cameraRef     = useRef(null);
  const barsRef       = useRef([]);
  const frameRef      = useRef(null);
  const clockRef      = useRef(new THREE.Clock());
  const gsapCtxRef    = useRef(null);

  const [inputValue,       setInputValue]       = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPH,      setDisplayedPH]      = useState('');
  const [isTypingPH,       setIsTypingPH]       = useState(true);
  const [isFocused,        setIsFocused]         = useState(false);

  /* ── Typing placeholder effect ── */
  useEffect(() => {
    const phrase = PLACEHOLDER_PHRASES[placeholderIndex];
    let charIdx = 0;
    let timeoutId;

    if (isTypingPH) {
      const type = () => {
        if (charIdx <= phrase.length) {
          setDisplayedPH(phrase.slice(0, charIdx));
          charIdx++;
          timeoutId = setTimeout(type, 55);
        } else {
          timeoutId = setTimeout(() => setIsTypingPH(false), 1800);
        }
      };
      type();
    } else {
      const erase = () => {
        if (charIdx >= 0) {
          setDisplayedPH(phrase.slice(0, charIdx));
          charIdx--;
          timeoutId = setTimeout(erase, 28);
        } else {
          setPlaceholderIndex(i => (i + 1) % PLACEHOLDER_PHRASES.length);
          setIsTypingPH(true);
        }
      };
      charIdx = phrase.length;
      erase();
    }
    return () => clearTimeout(timeoutId);
  }, [placeholderIndex, isTypingPH]);

  /* ── Three.js setup ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    /* Scene + Camera */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 1);
    sceneRef.current  = scene;
    cameraRef.current = camera;

    /* Bars */
    barsRef.current = BAR_CONFIGS.map((cfg, i) => {
      const geo = new THREE.PlaneGeometry(4, cfg.width, cfg.segments, 1);
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime:      { value: 0 },
          uAmplitude: { value: 0 },
          uFrequency: { value: 3 + i * 0.5 },
          uBarIndex:  { value: i },
          uTotalBars: { value: BAR_CONFIGS.length },
          uColorA:    { value: new THREE.Color(cfg.color) },
          uColorB:    { value: new THREE.Color('#ffffff') },
          uOpacity:   { value: 0 },
        },
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = cfg.yOffset;
      scene.add(mesh);
      return { mesh, mat, cfg, baseAmplitude: cfg.amplitude, baseSpeed: cfg.speed };
    });

    /* GSAP wave sequence (55-sec loop) */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      /* 0–5s: fade in all bars */
      barsRef.current.forEach(({ mat }, i) => {
        tl.to(mat.uniforms.uOpacity, { value: 0.9, duration: 2, ease: 'power2.out' }, i * 0.15);
        tl.to(mat.uniforms.uAmplitude, { value: BAR_CONFIGS[i].amplitude, duration: 3, ease: 'power2.out' }, i * 0.15);
      });

      /* 5–15s: calm wave */
      tl.to({}, { duration: 10 }, 5);

      /* 15–20s: surge */
      barsRef.current.forEach(({ mat }, i) => {
        tl.to(mat.uniforms.uAmplitude, { value: BAR_CONFIGS[i].amplitude * 2.5, duration: 2, ease: 'power2.inOut' }, 15 + i * 0.05);
      });

      /* 20–25s: calm again */
      barsRef.current.forEach(({ mat }, i) => {
        tl.to(mat.uniforms.uAmplitude, { value: BAR_CONFIGS[i].amplitude, duration: 3, ease: 'power2.inOut' }, 20 + i * 0.05);
      });

      /* 25–40s: drift */
      tl.to({}, { duration: 15 }, 25);

      /* 40–48s: second surge */
      barsRef.current.forEach(({ mat }, i) => {
        tl.to(mat.uniforms.uAmplitude, { value: BAR_CONFIGS[i].amplitude * 3, duration: 2, ease: 'power2.inOut' }, 40 + i * 0.05);
        tl.to(mat.uniforms.uAmplitude, { value: BAR_CONFIGS[i].amplitude, duration: 3, ease: 'power2.inOut' }, 43 + i * 0.05);
      });

      /* 48–55s: fade to loop */
      tl.to({}, { duration: 7 }, 48);
    });
    gsapCtxRef.current = ctx;

    /* Render loop */
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      barsRef.current.forEach(({ mat, cfg }, i) => {
        mat.uniforms.uTime.value = t * cfg.speed;
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    animate();

    /* Resize */
    const onResize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      gsapCtxRef.current?.revert();
      barsRef.current.forEach(({ mesh, mat }) => {
        mesh.geometry.dispose();
        mat.dispose();
        scene.remove(mesh);
      });
      renderer.dispose();
    };
  }, []);

  /* ── Submit handler ── */
  const handleSubmit = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    onPromptSubmit?.(text);
    setInputValue('');
    textareaRef.current?.focus();
  }, [inputValue, onPromptSubmit]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Three.js canvas — full background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070a0f] via-transparent to-[#070a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070a0f] via-transparent to-[#070a0f]" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6 w-full max-w-2xl" style={{ zIndex: 2 }}>
        {/* Title */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8 max-w-md">{subtitle}</p>

        {/* Input box */}
        <div
          className={`w-full rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'border-green-500/50 bg-white/[0.07] shadow-lg shadow-green-500/10'
              : 'border-white/[0.08] bg-white/[0.04]'
          }`}
        >
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={displayedPH}
            className="w-full bg-transparent resize-none px-5 pt-4 pb-2 text-sm text-white placeholder-slate-600 focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <p className="text-xs text-slate-600">Press Enter to send · Shift+Enter for new line</p>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30"
            >
              Send ↑
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {['Clay soil crops', 'Best fertilizer for wheat', 'Pest control rice', 'Kharif vs Rabi'].map(s => (
            <button
              key={s}
              onClick={() => { setInputValue(s); textareaRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
