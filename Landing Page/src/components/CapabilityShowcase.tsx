"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveThreatVisualizer from "@/components/InteractiveThreatVisualizer";

// SVGs for Icons
const CrawlerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

const NLPIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" />
  </svg>
);

const RadarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const GraphIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 14l8-4M9 16l8 4" />
  </svg>
);

// Platforms for Crawler Demo
type Platform = "Telegram" | "WhatsApp" | "Instagram";

interface CrawlerMessage {
  sender: string;
  text: string;
  time: string;
}

const CRAWLER_DATA: Record<Platform, { name: string; color: string; bg: string; messages: CrawlerMessage[] }> = {
  Telegram: {
    name: "Telegram Crawler",
    color: "#33b3f1",
    bg: "rgba(51, 179, 241, 0.1)",
    messages: [
      { sender: "@SpeedyNarcotics", text: "❄️ High Quality Snow in stock. DM for menu.", time: "14:32:01" },
      { sender: "@BotSystem", text: "Active channels scanned: 12. Monitoring message logs...", time: "14:32:05" },
      { sender: "@SpeedyNarcotics", text: "New Drop Point registered: coordinates updated.", time: "14:32:12" },
    ],
  },
  WhatsApp: {
    name: "WhatsApp Monitor",
    color: "#8dff55",
    bg: "rgba(141, 255, 85, 0.1)",
    messages: [
      { sender: "+1 (555) 302-8812", text: "Menu: 🍁 50g / $120. Drop off at 10 PM.", time: "14:32:22" },
      { sender: "+1 (555) 302-8812", text: "Sent location map drop point. Keep it clean.", time: "14:32:25" },
      { sender: "Auto-Ingest", text: "Triangulating endpoint number metadata...", time: "14:32:30" },
    ],
  },
  Instagram: {
    name: "Instagram DM Agent",
    color: "#e962bf",
    bg: "rgba(233, 98, 191, 0.1)",
    messages: [
      { sender: "narc_vibes_2", text: "Tap link in bio for secure drop chat channels. 📲", time: "14:32:41" },
      { sender: "System-Crawler", text: "User story capture completed. Story ID: 902183.", time: "14:32:45" },
      { sender: "narc_vibes_2", text: "DM for special drop rates this weekend only.", time: "14:32:51" },
    ],
  },
};

// Emojis for NLP Demo
interface SlangItem {
  emoji: string;
  coded: string;
  decoded: string;
  confidence: number;
}

const SLANG_DATA: SlangItem[] = [
  { emoji: "❄️", coded: "Ice / Snow", decoded: "Cocaine / Methamphetamine", confidence: 97.4 },
  { emoji: "🍁", coded: "Leaf / Green", decoded: "Cannabis / Marijuana", confidence: 99.1 },
  { emoji: "📍", coded: "Pin", decoded: "Dead-drop location coordinates", confidence: 95.8 },
  { emoji: "💊", coded: "Candy", decoded: "MDMA / Ecstasy pills", confidence: 98.2 },
];

export default function CapabilityShowcase() {
  const [activeItem, setActiveItem] = useState(0);
  
  // Sub-states for specific visualizer details
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("Telegram");
  const [selectedSlang, setSelectedSlang] = useState<number>(0);
  const [radarRotation, setRadarRotation] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Radar Animation Loop
  useEffect(() => {
    if (activeItem !== 2) return;
    const interval = setInterval(() => {
      setRadarRotation((prev) => (prev + 1) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [activeItem]);

  const items = [
    {
      title: "Stealth Crawlers",
      desc: "Continuous, low-footprint scraping of illicit bot networks and distribution menus across mainstream messaging applications.",
      icon: <CrawlerIcon />,
      controls: (
        <div className="flex gap-2 mt-4 flex-wrap">
          {(["Telegram", "WhatsApp", "Instagram"] as Platform[]).map((plat) => (
            <button
              key={plat}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlatform(plat);
              }}
              style={{
                background: selectedPlatform === plat ? CRAWLER_DATA[plat].color : "rgba(255,255,255,0.03)",
                color: selectedPlatform === plat ? "#1a1918" : "var(--fg-2)",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <img 
                src={plat === "Telegram" ? "/telegram.png" : plat === "WhatsApp" ? "/whatsapp.png" : "/instagram.png"} 
                alt={plat} 
                width="14" 
                height="14" 
                style={{ objectFit: "contain", filter: selectedPlatform === plat ? "brightness(0.1)" : "none" }} 
              />
              {plat}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Gemini NLP Parsing",
      desc: "Resolves coded dialogues, emoji pricing structures, and localized drug slang inside messaging streams using specialized Gemini models.",
      icon: <NLPIcon />,
      controls: (
        <div className="grid grid-cols-2 gap-1.5 mt-4">
          {SLANG_DATA.map((slang, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSlang(idx);
              }}
              style={{
                background: selectedSlang === idx ? "rgba(255, 125, 54, 0.15)" : "rgba(255,255,255,0.02)",
                borderColor: selectedSlang === idx ? "var(--coral)" : "rgba(255,255,255,0.05)",
                color: selectedSlang === idx ? "var(--fg-1)" : "var(--fg-3)",
                textAlign: "left",
                fontSize: "0.72rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius)",
                borderWidth: "1px",
                borderStyle: "solid",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{slang.emoji}</span>
              <span>{slang.coded}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Metadata Triangulation",
      desc: "Triangulates threat endpoints by parsing IP routing leaks, device fingerprints, and location markers embedded inside files and chats.",
      icon: <RadarIcon />,
      controls: (
        <div className="mt-4 p-3 rounded bg-white/5 border border-white/5" style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--fg-3)" }}>
          <div style={{ color: "var(--coral)", fontWeight: "bold", marginBottom: "4px" }}>&gt; SCANNING STATUS</div>
          <div>SWEEP DEPTH: 16 HOPS</div>
          <div>ACTIVE NODES: 8 DETECTED</div>
        </div>
      ),
    },
    {
      title: "Relational Knowledge Graph",
      desc: "Unifies isolated bot profiles and drop spots across multiple platforms into a single connected Neo4j knowledge network to resolve identity networks.",
      icon: <GraphIcon />,
      controls: (
        <div className="mt-4" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--fg-4)" }}>
          Hover over nodes on the right to inspect suspect relational pathways.
        </div>
      ),
    },
  ];

  const handleNext = () => {
    setActiveItem((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveItem((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="showcase-wrapper" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem", marginTop: "2.5rem" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .showcase-grid {
            grid-template-columns: 1.05fr 0.95fr;
            align-items: stretch;
          }
        }
        .showcase-viewport {
          position: relative;
          background: var(--bg-2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius);
          height: 380px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5), 0 20px 40px rgba(0,0,0,0.3);
        }
        @media (min-width: 900px) {
          .showcase-viewport {
            height: auto;
            min-height: 420px;
          }
        }
        .acc-item {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 1.25rem 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .acc-item:last-child {
          border-bottom: none;
        }
        .acc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .acc-title {
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: color 0.3s ease;
        }
      `}} />

      <div className="showcase-grid">
        
        {/* Left Column: Expandable Accordion list */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {items.map((item, idx) => {
              const isOpen = activeItem === idx;
              return (
                <div
                  key={idx}
                  className="acc-item"
                  onClick={() => setActiveItem(idx)}
                >
                  <div className="acc-header">
                    <span className="acc-title" style={{ color: isOpen ? "var(--fg-1)" : "var(--fg-4)" }}>
                      <span style={{ color: isOpen ? "var(--coral)" : "var(--fg-4)", display: "flex" }}>
                        {item.icon}
                      </span>
                      {item.title}
                    </span>
                    
                    {/* Expand/Collapse Plus-Minus Icon */}
                    <motion.div
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ color: isOpen ? "var(--coral)" : "var(--fg-4)", display: "flex" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ fontSize: "0.9rem", color: "var(--fg-3)", lineHeight: 1.6 }}>
                          {item.desc}
                        </p>
                        {item.controls}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Nav arrows & pagination */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handlePrev}
                className="btn-outline"
                style={{ padding: "0.5rem", borderRadius: "50%", minWidth: "36px", height: "36px", justifyContent: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={handleNext}
                className="btn-outline"
                style={{ padding: "0.5rem", borderRadius: "50%", minWidth: "36px", height: "36px", justifyContent: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--fg-4)" }}>
              0{activeItem + 1} / 0{items.length}
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Animation Viewport */}
        <div 
          className="showcase-viewport"
          style={{
            maxWidth: (activeItem === 0 && (selectedPlatform === "Telegram" || selectedPlatform === "Instagram")) 
              ? (selectedPlatform === "Telegram" ? "280px" : "300px") 
              : "100%",
            margin: "0 auto",
            width: "100%",
            transition: "max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          
          <AnimatePresence mode="wait">
            {activeItem === 0 && (
              <motion.div
                key="crawler-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", width: "100%", padding: (selectedPlatform === "Telegram" || selectedPlatform === "Instagram") ? "0" : "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                {selectedPlatform === "Telegram" ? (
                  <img
                    src="/images/telegram-crawler.png"
                    alt="Telegram Crawler Ingestion"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                ) : selectedPlatform === "Instagram" ? (
                  <img
                    src="/images/instagram-crawler.png"
                    alt="Instagram Crawler Ingestion"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    maxWidth: "280px",
                    background: "var(--bg-1)",
                    borderRadius: "16px",
                    border: `1.5px solid ${CRAWLER_DATA[selectedPlatform].color}`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: `0 15px 30px rgba(0,0,0,0.2), 0 0 20px ${CRAWLER_DATA[selectedPlatform].bg}`
                  }}>
                    {/* Chat Header */}
                    <div style={{
                      background: "var(--bg-2)",
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--bg-3)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <img 
                        src="/whatsapp.png" 
                        alt="WhatsApp" 
                        width="16" 
                        height="16" 
                        style={{ objectFit: "contain" }} 
                      />
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                        {CRAWLER_DATA[selectedPlatform].name}
                      </span>
                    </div>

                    {/* Chat Message Stream */}
                    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "180px" }}>
                      {CRAWLER_DATA[selectedPlatform].messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15, duration: 0.3 }}
                          style={{
                            background: msg.sender.startsWith("@") || msg.sender.startsWith("+") ? "var(--bg-2)" : CRAWLER_DATA[selectedPlatform].bg,
                            padding: "8px 10px",
                            borderRadius: "8px",
                            border: msg.sender.startsWith("@") || msg.sender.startsWith("+") ? "1px solid var(--bg-4)" : "1px solid var(--bg-3)"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                            <span style={{ fontSize: "0.62rem", fontWeight: "bold", color: CRAWLER_DATA[selectedPlatform].color }}>
                              {msg.sender}
                            </span>
                            <span style={{ fontSize: "0.55rem", color: "var(--fg-5)", fontFamily: "var(--font-mono)" }}>
                              {msg.time}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.68rem", color: "var(--fg-2)" }}>{msg.text}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Chat Footer Input Mock */}
                    <div style={{ padding: "8px 12px", borderTop: "1px solid var(--bg-3)", fontSize: "0.62rem", color: "var(--fg-4)", fontStyle: "italic", fontFamily: "var(--font-mono)" }}>
                      &gt; INGESTION_STREAMING_ONLINE
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeItem === 1 && (
              <motion.div
                key="nlp-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", width: "100%", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                {/* Slang Decryptor Display */}
                <div style={{ background: "var(--bg-1)", border: "1px solid var(--bg-3)", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}>
                  
                  {/* Analysis Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bg-3)", paddingBottom: "10px", marginBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--coral)" }} />
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>GEMINI_NLP_ENGINE</span>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--fg-4)" }}>v1.3_PARSER</span>
                  </div>

                  {/* Bubble Demo Text */}
                  <div style={{ padding: "10px", background: "var(--bg-2)", borderRadius: "8px", border: "1px solid var(--bg-4)", marginBottom: "15px" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--fg-4)", display: "block", marginBottom: "4px", fontFamily: "var(--font-mono)" }}>RAW INGESTED DIALOGUE:</span>
                    <p style={{ fontSize: "0.85rem", color: "var(--fg-2)" }}>
                      &quot;Need 3 bags of <span style={{ background: "rgba(255, 125, 54, 0.2)", color: "var(--coral)", padding: "1px 4px", borderRadius: "3px" }}>{SLANG_DATA[selectedSlang].emoji} {SLANG_DATA[selectedSlang].coded}</span> left at the drop point 📍 Sector 4 ASAP.&quot;
                    </p>
                  </div>

                  {/* Gemini Decryption Panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", borderBottom: "1px solid var(--bg-3)", paddingBottom: "6px" }}>
                      <span style={{ color: "var(--fg-4)" }}>IDENTIFIED SLANG:</span>
                      <span style={{ color: "var(--coral)", fontWeight: "bold" }}>{SLANG_DATA[selectedSlang].coded}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--fg-4)" }}>SEMANTIC DECRYPTION:</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--turquoise)", fontWeight: "bold", fontFamily: "var(--font-mono)" }}>
                        {SLANG_DATA[selectedSlang].decoded}
                      </span>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--fg-4)", marginBottom: "4px" }}>
                        <span>GEMINI CONFIDENCE:</span>
                        <span>{SLANG_DATA[selectedSlang].confidence}%</span>
                      </div>
                      <div style={{ height: "4px", width: "100%", background: "var(--bg-5)", borderRadius: "2px", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${SLANG_DATA[selectedSlang].confidence}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          style={{ height: "100%", background: "var(--turquoise)" }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {activeItem === 2 && (
              <motion.div
                key="radar-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", width: "100%" }}
              >
                <InteractiveThreatVisualizer borderless />
              </motion.div>
            )}

            {activeItem === 3 && (
              <motion.div
                key="graph-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", width: "100%", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                {/* SVG Connected Nodes Graph */}
                <div style={{ position: "relative", width: "100%", maxWidth: "300px", height: "260px", background: "var(--bg-2)", borderRadius: "12px", border: "1px solid var(--bg-3)" }}>
                  
                  {/* SVG paths for connection links */}
                  <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    {/* Gemini to Telegram */}
                    <line x1="150" y1="130" x2="60" y2="70" stroke={hoveredNode === "telegram" ? "var(--sky)" : "var(--bg-4)"} strokeWidth={hoveredNode === "telegram" ? 2.5 : 1} style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }} />
                    {/* Gemini to WhatsApp */}
                    <line x1="150" y1="130" x2="240" y2="70" stroke={hoveredNode === "whatsapp" ? "var(--green)" : "var(--bg-4)"} strokeWidth={hoveredNode === "whatsapp" ? 2.5 : 1} style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }} />
                    {/* Gemini to Instagram */}
                    <line x1="150" y1="130" x2="150" y2="210" stroke={hoveredNode === "instagram" ? "var(--pink)" : "var(--bg-4)"} strokeWidth={hoveredNode === "instagram" ? 2.5 : 1} style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }} />
                    
                    {/* Cross links */}
                    <line x1="60" y1="70" x2="150" y2="210" stroke={hoveredNode === "shared" ? "var(--coral)" : "var(--bg-3)"} strokeWidth={hoveredNode === "shared" ? 2 : 0.8} style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }} />
                    <line x1="240" y1="70" x2="150" y2="210" stroke={hoveredNode === "shared" ? "var(--coral)" : "var(--bg-3)"} strokeWidth={hoveredNode === "shared" ? 2 : 0.8} style={{ transition: "stroke 0.25s ease, stroke-width 0.25s ease" }} />
                  </svg>

                  {/* Core Gemini Node */}
                  <div
                    style={{
                      position: "absolute",
                      top: "130px",
                      left: "150px",
                      transform: "translate(-50%, -50%)",
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--coral), var(--red))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1a1918",
                      boxShadow: hoveredNode === "core" ? "0 0 20px rgba(255, 125, 54, 0.6)" : "0 0 15px rgba(255, 125, 54, 0.4)",
                      fontSize: "0.62rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={() => setHoveredNode("core")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    Gemini
                  </div>

                  {/* Telegram suspect node */}
                  <div
                    style={{
                      position: "absolute",
                      top: "70px",
                      left: "60px",
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(51, 179, 241, 0.15)",
                      border: "1.5px solid #33b3f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: hoveredNode === "telegram" ? "var(--sky)" : "var(--fg-2)",
                      boxShadow: hoveredNode === "telegram" ? "0 0 15px var(--sky)" : "none",
                      fontSize: "0.6rem",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={() => setHoveredNode("telegram")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <img 
                       src="/telegram.png" 
                       alt="Telegram" 
                       width="20" 
                       height="20" 
                       style={{ objectFit: "contain" }} 
                    />
                  </div>

                  {/* WhatsApp suspect node */}
                  <div
                    style={{
                      position: "absolute",
                      top: "70px",
                      left: "240px",
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(37, 211, 102, 0.15)",
                      border: "1.5px solid #25D366",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: hoveredNode === "whatsapp" ? "var(--green)" : "var(--fg-2)",
                      boxShadow: hoveredNode === "whatsapp" ? "0 0 15px var(--green)" : "none",
                      fontSize: "0.6rem",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={() => setHoveredNode("whatsapp")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <img 
                       src="/whatsapp.png" 
                       alt="WhatsApp" 
                       width="20" 
                       height="20" 
                       style={{ objectFit: "contain" }} 
                    />
                  </div>

                  {/* Instagram suspect node */}
                  <div
                    style={{
                      position: "absolute",
                      top: "210px",
                      left: "150px",
                      transform: "translate(-50%, -50%)",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(233, 98, 191, 0.15)",
                      border: "1.5px solid #e962bf",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: hoveredNode === "instagram" ? "var(--pink)" : "var(--fg-2)",
                      boxShadow: hoveredNode === "instagram" ? "0 0 15px var(--pink)" : "none",
                      fontSize: "0.6rem",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={() => setHoveredNode("instagram")}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <img 
                       src="/instagram.png" 
                       alt="Instagram" 
                       width="20" 
                       height="20" 
                       style={{ objectFit: "contain" }} 
                    />
                  </div>

                  {/* Tooltip Overlay */}
                  <AnimatePresence>
                    {hoveredNode && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "8px",
                          right: "8px",
                          background: "var(--bg-2)",
                          border: "1px solid var(--bg-4)",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          color: "var(--fg-3)",
                          pointerEvents: "none"
                        }}
                      >
                        {hoveredNode === "core" && (
                          <div><strong style={{ color: "var(--coral)" }}>AI CORRELATION ENGINE:</strong> Resolving connections dynamically across multi-platform feeds.</div>
                        )}
                        {hoveredNode === "telegram" && (
                          <div><strong style={{ color: "var(--sky)" }}>TELEGRAM SUIC_ID:</strong> @SpeedyNarc. Connected to IG profile via matching timestamp fingerprints.</div>
                        )}
                        {hoveredNode === "whatsapp" && (
                          <div><strong style={{ color: "var(--green)" }}>WHATSAPP ENCRYPT:</strong> +1 (555) 302-8812. Target location matches drop zones.</div>
                        )}
                        {hoveredNode === "instagram" && (
                          <div><strong style={{ color: "var(--pink)" }}>INSTA DM LINK:</strong> narc_vibes_2. Sharing Telegram channel bio links.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
