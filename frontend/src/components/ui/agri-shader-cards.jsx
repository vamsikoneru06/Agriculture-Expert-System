import React from "react";
import { Link } from "react-router-dom";
import { Warp } from "@paper-design/shaders-react";
import { Leaf, Thermometer, BrainCircuit, MessageSquare, ArrowRight } from "lucide-react";

const AGRI_CARDS = [
  {
    to:          "/expert",
    label:       "Expert System",
    sub:         "IF-THEN rule inference · 25 knowledge rules",
    icon:        Leaf,
    shape:       "checks",
    colors:      ["hsl(150,100%,12%)", "hsl(130,100%,38%)", "hsl(160,90%,20%)", "hsl(140,100%,55%)"],
    proportion:  0.32,
    softness:    0.9,
    distortion:  0.14,
    swirl:       0.7,
    swirlIter:   9,
    shapeScale:  0.09,
  },
  {
    to:          "/simulation",
    label:       "Simulation",
    sub:         "Real-time environmental modeling",
    icon:        Thermometer,
    shape:       "dots",
    colors:      ["hsl(25,100%,18%)", "hsl(40,100%,52%)", "hsl(35,90%,28%)", "hsl(45,100%,65%)"],
    proportion:  0.4,
    softness:    1.1,
    distortion:  0.2,
    swirl:       0.85,
    swirlIter:   12,
    shapeScale:  0.11,
  },
  {
    to:          "/ml",
    label:       "ML Prediction",
    sub:         "Random Forest · 1,000+ training samples",
    icon:        BrainCircuit,
    shape:       "checks",
    colors:      ["hsl(265,100%,18%)", "hsl(280,100%,55%)", "hsl(270,90%,25%)", "hsl(275,100%,68%)"],
    proportion:  0.35,
    softness:    0.95,
    distortion:  0.17,
    swirl:       0.75,
    swirlIter:   10,
    shapeScale:  0.1,
  },
  {
    to:          "/chatbot",
    label:       "AI Chatbot",
    sub:         "AgriBot · Powered by Google Gemini",
    icon:        MessageSquare,
    shape:       "dots",
    colors:      ["hsl(195,100%,14%)", "hsl(185,100%,48%)", "hsl(200,90%,22%)", "hsl(190,100%,62%)"],
    proportion:  0.38,
    softness:    1.0,
    distortion:  0.18,
    swirl:       0.8,
    swirlIter:   11,
    shapeScale:  0.12,
  },
];

export default function AgriShaderCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {AGRI_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.to}
            to={card.to}
            className="group relative h-52 rounded-2xl overflow-hidden block focus:outline-none"
          >
            {/* Shader background */}
            <div className="absolute inset-0">
              <Warp
                style={{ height: "100%", width: "100%" }}
                proportion={card.proportion}
                softness={card.softness}
                distortion={card.distortion}
                swirl={card.swirl}
                swirlIterations={card.swirlIter}
                shape={card.shape}
                shapeScale={card.shapeScale}
                scale={1}
                rotation={0}
                speed={0.6}
                colors={card.colors}
              />
            </div>

            {/* Glass overlay */}
            <div
              className="relative z-10 h-full flex flex-col justify-between p-5 transition-all duration-300"
              style={{
                background: "rgba(6,10,6,0.72)",
                border: "1px solid rgba(74,222,128,0.12)",
                borderRadius: "1rem",
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}
              >
                <Icon size={18} style={{ color: "#4ade80" }} />
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-display font-bold text-[15px] leading-tight mb-1"
                  style={{ color: "#e8f5e8" }}
                >
                  {card.label}
                </p>
                <p
                  className="text-[11px] leading-snug mb-3"
                  style={{ color: "rgba(180,210,180,0.55)" }}
                >
                  {card.sub}
                </p>
                <div
                  className="flex items-center gap-1 text-[11px] font-bold transition-all group-hover:gap-2"
                  style={{ color: "#4ade80" }}
                >
                  Open <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
