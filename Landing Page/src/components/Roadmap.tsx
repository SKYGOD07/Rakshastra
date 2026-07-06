"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// Clean vector SVG icons for target stack integrations (zero external assets/broken links!)
const GcpIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(66,133,244,0.2))" }}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" fill="#4285F4" />
  </svg>
);

const GeminiIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 4px 12px rgba(166,91,240,0.3))" }}>
    <defs>
      <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4e82ee" />
        <stop offset="50%" stopColor="#a65bf0" />
        <stop offset="100%" stopColor="#f58071" />
      </linearGradient>
    </defs>
    <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.5228 12 22C12 16.5228 16.5228 12 22 12C16.5228 12 12 7.52285 12 2Z" fill="url(#gemini-grad)" />
  </svg>
);

const Neo4jIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#00d5ff" strokeWidth="2" style={{ filter: "drop-shadow(0 4px 8px rgba(0,213,255,0.2))" }}>
    <circle cx="12" cy="6" r="3.5" fill="#00d5ff" />
    <circle cx="6" cy="17" r="3.5" fill="#00d5ff" />
    <circle cx="18" cy="17" r="3.5" fill="#00d5ff" />
    <line x1="12" y1="9.5" x2="6.5" y2="13.5" />
    <line x1="12" y1="9.5" x2="17.5" y2="13.5" />
    <line x1="9.5" y1="17" x2="14.5" y2="17" />
  </svg>
);

const TelegramIcon = () => (
  <img src="/telegram.png" alt="Telegram" width="42" height="42" style={{ filter: "drop-shadow(0 4px 8px rgba(34,158,217,0.25))", objectFit: "contain" }} />
);

const WhatsAppIcon = () => (
  <img src="/whatsapp.png" alt="WhatsApp" width="42" height="42" style={{ filter: "drop-shadow(0 4px 8px rgba(37,211,102,0.25))", objectFit: "contain" }} />
);

const InstagramIcon = () => (
  <img src="/instagram.png" alt="Instagram" width="42" height="42" style={{ filter: "drop-shadow(0 4px 8px rgba(233,98,191,0.25))", objectFit: "contain" }} />
);

const TwilioIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(242,47,70,0.2))" }}>
    <circle cx="12" cy="12" r="12" fill="#F22F46" />
    <circle cx="9" cy="9" r="1.5" fill="white" />
    <circle cx="15" cy="9" r="1.5" fill="white" />
    <circle cx="9" cy="15" r="1.5" fill="white" />
    <circle cx="15" cy="15" r="1.5" fill="white" />
  </svg>
);

const GithubIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--fg-1)" }}>
    <path d="M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.495 9.025 23.125 9.025 22.805C9.025 22.515 9.015 21.755 9.015 20.735C5.675 21.465 4.975 19.135 4.975 19.135C4.425 17.745 3.635 17.375 3.635 17.375C2.545 16.635 3.715 16.655 3.715 16.655C4.915 16.735 5.545 17.885 5.545 17.885C6.615 19.725 8.355 19.195 9.035 18.885C9.145 18.105 9.455 17.575 9.795 17.275C7.135 16.975 4.335 15.945 4.335 11.345C4.335 10.035 4.8 8.965 5.565 8.125C5.445 7.825 5.035 6.605 5.675 4.955C5.675 4.955 6.685 4.635 8.975 6.185C9.935 5.915 10.965 5.785 11.995 5.785C13.025 5.785 14.055 5.915 15.015 6.185C17.305 4.635 18.305 4.955 18.305 4.955C18.945 6.605 18.535 7.825 18.425 8.125C19.195 8.965 19.655 10.035 19.655 11.345C19.655 15.955 16.855 16.975 14.185 17.265C14.615 17.635 15.005 18.375 15.005 19.505C15.005 21.125 14.995 22.435 14.995 22.825C14.995 23.145 15.205 23.515 15.815 23.395C20.575 21.795 24 17.3 24 12C24 5.37 18.63 0 12 0Z" />
  </svg>
);

const NextjsIcon = () => (
  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--fg-1)" strokeWidth="1.5">
    <circle cx="12" cy="12" r="11" fill="none" />
    <path d="M7.5 17.5L14.5 7.5V16.5" />
    <path d="M12 12L16.5 17.5" />
  </svg>
);

const macIcon = [
  GcpIcon,
  GeminiIcon,
  Neo4jIcon,
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
  TwilioIcon,
  GithubIcon,
  NextjsIcon,
];

const phases = [
  {
    phase: "Phase 1",
    cls: "p1",
    title: "Setup & Cloud Infrastructure",
    tagline: "Laying the secure foundation for the OSINT ecosystem",
    desc: "Configure security-hardened environments and provision database services with unified identity access management.",
    bullets: [
      "Fork the core Hermes codebase and implement continuous deployment via Cloud Build pipelines.",
      "Provision serverless GCP Cloud Run containers running with isolated IAM profiles.",
      "Initialize high-performance Neo4j Graph Database and resilient serverless Firestore instances.",
      "Configure encrypted credential vaults and establish connection tunnels for the Gemini API."
    ]
  },
  {
    phase: "Phase 2",
    cls: "p2",
    title: "Data Ingestion Pipelines",
    tagline: "Connecting live endpoints to ingest high-fidelity intelligence",
    desc: "Establish secure data listeners and scrapers to channel OSINT content directly into automated processing systems.",
    bullets: [
      "Deploy custom Telegram API listeners subscribing to public and private investigation streams.",
      "Configure headless Instagram scrapers running through rotating proxy networks to prevent rate limiting.",
      "Build real-time ETL pipelines utilizing structured regex parsing to sanitize raw text blocks.",
      "Map cross-platform identities into the Neo4j threat graph, establishing tracking vectors."
    ]
  },
  {
    phase: "Phase 3",
    cls: "p3",
    title: "Core Agent Security Skills",
    tagline: "Empowering AI agents with logical reasoning and footprint protection",
    desc: "Develop advanced LLM chains to analyze threat contexts safely while keeping agent footprints invisible.",
    bullets: [
      "Implement IP isolation layers, Tor-routing wrappers, and mock user agents to hide footprints.",
      "Integrate entity-extraction algorithms targeting phone numbers, crypto wallets, and hidden links.",
      "Design Gemini 1.5 Pro chain-of-thought routing to deduce coordination patterns.",
      "Deploy localized auto-summarization templates to produce rapid incident intelligence reports."
    ]
  },
  {
    phase: "Phase 4",
    cls: "p4",
    title: "Investigator Dashboard & Alerts",
    tagline: "Synthesizing graph networks into visual command centers",
    desc: "Create interactive user interfaces for real-time visualization, query filters, and instant notification systems.",
    bullets: [
      "Develop a React-based interactive canvas rendering real-time Neo4j network graphs.",
      "Build tabular search filters querying actors, timestamps, threat weights, and platforms.",
      "Integrate Twilio API handlers to format and dispatch immediate threat alerts directly to WhatsApp.",
      "Configure multi-user access levels ensuring sensitive investigations remain strictly audited."
    ]
  },
  {
    phase: "Phase 5",
    cls: "p5",
    title: "Pilot Deployment & Optimization",
    tagline: "Validating operational stability and scaling output quality",
    desc: "Perform full-scale threat simulations, refine linguistic evaluation parameters, and deploy live integrations.",
    bullets: [
      "Simulate cross-platform threat campaigns to analyze end-to-end system response latency.",
      "Finetune context prompts to decrease false positives and raise accuracy of entities extracted.",
      "Secure production endpoints via OAuth2 credentials, strict CSRF mitigation, and session timeouts.",
      "Establish automated feedback loops with partner agencies to continuously refine threat weight rules."
    ]
  }
];

export interface TiltCardProps {
  tiltLimit?: number;
  scale?: number;
  perspective?: number;
  effect?: "gravitate" | "evade";
  spotlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function TiltCard({
  tiltLimit = 15,
  scale = 1.05,
  perspective = 1200,
  effect = "evade",
  spotlight = true,
  className,
  style,
  children,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const dir = effect === "evade" ? -1 : 1;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const xRot = (py - 0.5) * (tiltLimit * 2) * dir;
      const yRot = (px - 0.5) * -(tiltLimit * 2) * dir;
      setTransform(
        `perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
      if (spotlight) {
        setSpotlightPos({ x: px * 100, y: py * 100 });
      }
    },
    [tiltLimit, scale, perspective, dir, spotlight]
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setIsHovered(false);
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("will-change-transform relative overflow-hidden", className)}
      style={{
        transform,
        transition: "transform 0.2s ease-out",
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <div
            className="absolute w-[200%] h-[200%] rounded-full opacity-100 dark:opacity-50"
            style={{
              left: `${spotlightPos.x}%`,
              top: `${spotlightPos.y}%`,
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 40%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  // Split and converge between 0.05 and 0.38 scroll progress
  const x = useTransform(
    scrollYProgress,
    [0.05, 0.38],
    [`${distanceFromCenter * 2.2}vw`, "0vw"]
  );
  const opacity = useTransform(scrollYProgress, [0.05, 0.28], [0, 1]);
  const rotateY = useTransform(
    scrollYProgress,
    [0.05, 0.38],
    [distanceFromCenter * 40, 0]
  );

  return (
    <motion.span
      className="inline-block"
      style={{
        x,
        opacity,
        rotateY,
        margin: isSpace ? "0 0.5rem" : "0 0.05rem",
        willChange: "transform, opacity",
      }}
    >
      {char}
    </motion.span>
  );
};

const CharacterV2 = ({
  icon: IconComponent,
  index,
  centerIndex,
  scrollYProgress,
}: {
  icon: React.ComponentType;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const distanceFromCenter = index - centerIndex;

  // Tech stack icons split and converge between 0.58 and 0.88 scroll progress
  const x = useTransform(
    scrollYProgress,
    [0.58, 0.88],
    [`${distanceFromCenter * 4.5}vw`, "0vw"]
  );
  const scale = useTransform(scrollYProgress, [0.58, 0.88], [0.6, 1]);
  const y = useTransform(
    scrollYProgress,
    [0.58, 0.88],
    [Math.abs(distanceFromCenter) * 32, 0]
  );
  const opacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);

  return (
    <motion.div
      style={{
        x,
        scale,
        y,
        opacity,
        transformOrigin: "center",
        display: "inline-block",
        margin: "0 0.5vw",
        willChange: "transform, opacity",
      }}
    >
      <IconComponent />
    </motion.div>
  );
};

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      ></path>
    </svg>
  );
};

const StickyPhaseCard = ({
  i,
  phase,
  title,
  tagline,
  desc,
  bullets,
  cls,
  progress,
  range,
  targetScale,
  isMobile,
}: {
  i: number;
  phase: string;
  title: string;
  tagline: string;
  desc: string;
  bullets: string[];
  cls: string;
  progress: any;
  range: [number, number];
  targetScale: number;
  isMobile: boolean;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scaleVal = useTransform(progress, range, [1, targetScale]);
  const scale = isMobile ? 1 : scaleVal;

  return (
    <div
      ref={container}
      className={isMobile ? "relative flex items-center justify-center w-full py-3 px-1" : "sticky top-0 flex items-center justify-center w-full min-h-[70vh] py-12"}
      style={{
        zIndex: i + 1,
      }}
    >
      <motion.div
        style={{
          scale,
          top: isMobile ? 0 : `calc(10vh + ${i * 24}px)`,
          backgroundColor: "var(--bg-3)",
          willChange: "transform",
        }}
        className={cn(
          "relative w-full max-w-5xl rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-2xl origin-top"
        )}
      >
        <div className="p-6 sm:p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Side: Title, Phase, Tagline & Main Description */}
            <div className="md:col-span-5 flex flex-col justify-center text-left">
              <span className={`roadmap-phase ${cls}`} style={{ display: "inline-block", width: "fit-content", marginBottom: "0.75rem" }}>
                {phase}
              </span>
              <h4 style={{ fontSize: isMobile ? "1.5rem" : "1.85rem", fontWeight: "800", color: "var(--fg-1)", marginBottom: "0.5rem", lineHeight: "1.2" }}>
                {title}
              </h4>
              <p className="text-accent font-semibold mb-3 md:mb-4" style={{ fontSize: isMobile ? "0.9rem" : "0.95rem" }}>
                {tagline}
              </p>
              <p style={{ fontSize: isMobile ? "0.85rem" : "0.95rem", color: "var(--fg-3)", lineHeight: "1.6", margin: 0 }}>
                {desc}
              </p>
            </div>

            {/* Right Side: Key Deliverables list */}
            <div className="md:col-span-7 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.06)] pt-5 md:pt-0 md:pl-8 text-left">
              <span className="text-[0.7rem] uppercase tracking-wider text-accent font-mono mb-1 block">Key deliverables</span>
              {bullets.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="flex items-start gap-2.5">
                  <span className="text-accent text-sm mt-0.5 select-none">✓</span>
                  <p style={{ fontSize: isMobile ? "0.85rem" : "0.9rem", color: "var(--fg-2)", lineHeight: "1.5", margin: 0 }}>
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StickyPhasesTimeline = ({ phases, isMobile }: { phases: any[]; isMobile: boolean }) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={container}
      className={isMobile ? "relative flex w-full flex-col items-center justify-center gap-5 pt-4 pb-8" : "relative flex w-full flex-col items-center justify-center pt-8 pb-[10vh]"}
    >
      {phases.map((p, i) => {
        // Calculate scaling factors so bottom cards stack behind top cards nicely
        const targetScale = Math.max(0.85, 1 - (phases.length - i - 1) * 0.03);
        return (
          <StickyPhaseCard
            key={i}
            i={i}
            {...p}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
};

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll position of the parent section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll using a spring for premium visual feedback
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 25,
    restDelta: 0.001,
  });

  const text = "EXECUTION STRATEGY";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);
  const iconCenterIndex = Math.floor(macIcon.length / 2);

  // Transforms to fade Stage 1 out and Stage 2 in inside the sticky viewport
  // Extended the hold duration of the text (fully visible until 0.55 progress) so it stays legible for longer
  const textStageOpacity = useTransform(smoothProgress, [0.0, 0.55, 0.65], [1, 1, 0]);
  const textStageScale = useTransform(smoothProgress, [0.0, 0.55, 0.65], [1, 1, 0.95]);

  const iconStageOpacity = useTransform(smoothProgress, [0.55, 0.65, 0.98], [0, 1, 1]);
  const iconStageY = useTransform(smoothProgress, [0.55, 0.65], [40, 0]);

  if (isMobile) {
    return (
      <section ref={containerRef} className="phases-section" id="roadmap" style={{ position: "relative", zIndex: 10 }}>
        <style dangerouslySetInnerHTML={{__html: `
          .phases-section {
            padding: 4rem 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .phases-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            width: 100%;
          }
          .phase-card-wrapper {
            display: flex;
          }
          .phase-card {
            background: rgba(32, 31, 30, 0.45);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius);
            padding: 2rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            transition: border-color 0.3s ease, background 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            width: 100%;
            height: 100%;
          }
          .phase-card:hover {
            border-color: var(--accent);
            background: rgba(40, 39, 38, 0.65);
          }
          html.light .phase-card {
            background: rgba(255, 255, 255, 0.5);
            border-color: rgba(0, 0, 0, 0.06);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.03);
          }
          html.light .phase-card:hover {
            border-color: var(--accent);
            background: rgba(255, 255, 255, 0.8);
          }
        `}} />

        {/* 1. Integration Stack Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span className="section-label">System Architecture</span>
          <h3 className="section-heading" style={{ fontSize: "2rem", margin: "0.5rem 0", color: "var(--fg-1)" }}>
            Core Integrations
          </h3>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem", marginBottom: "4rem", padding: "0 0.5rem" }}>
          {macIcon.map((Icon, idx) => (
            <div key={idx} style={{ transform: "scale(0.8)" }}>
              <Icon />
            </div>
          ))}
        </div>

        {/* 2. Timeline Section */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="section-label">Execution Strategy</span>
          <h3 className="section-heading" style={{ fontSize: "2rem", margin: "0.5rem 0", color: "var(--fg-1)" }}>
            Implementation Timeline
          </h3>
          <p className="section-desc">Five distinct phases designed for robust platform deployment.</p>
        </div>

        <StickyPhasesTimeline phases={phases} isMobile={isMobile} />
      </section>
    );
  }

  return (
    <>
      {/* 1. DEDICATED STICKY SCROLL SECTION */}
      <section
        ref={containerRef}
        className="relative w-full"
        id="roadmap"
        style={{ minHeight: "160vh" }}
      >
        {/* STICKY VIEWPORT CONTAINER */}
        <div
          style={{
            position: "sticky",
            top: "12vh",
            height: "76vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            width: "100%",
            zIndex: 5,
          }}
        >
          <span
            className="section-label"
            style={{
              position: "absolute",
              top: "2rem",
              opacity: 0.5,
            }}
          >
            System Architecture
          </span>

          {/* Stage 1: Character Splitting Text Reveal */}
          <motion.div
            style={{
              opacity: textStageOpacity,
              scale: textStageScale,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                perspective: "600px",
                fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
                fontWeight: 800,
                color: "var(--fg-1)",
                letterSpacing: "-0.03em",
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {characters.map((char, index) => (
                <CharacterV1
                  key={index}
                  char={char}
                  index={index}
                  centerIndex={centerIndex}
                  scrollYProgress={smoothProgress}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--fg-3)", fontFamily: "var(--font-mono)", opacity: 0.7 }}>
              [ Scroll Down to Track Integration Stack ]
            </span>
          </motion.div>

          {/* Stage 2: Tech Icon Splitting Reveal */}
          <motion.div
            style={{
              opacity: iconStageOpacity,
              y: iconStageY,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2.5rem",
              width: "100%",
              maxWidth: "900px",
              padding: "0 1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                color: "var(--fg-1)",
                textAlign: "center",
              }}
            >
              <Bracket className="h-10 text-accent" />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Rakshastra Core Integrations
              </span>
              <Bracket className="h-10 scale-x-[-1] text-accent" />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {macIcon.map((Icon, index) => (
                <CharacterV2
                  key={index}
                  icon={Icon}
                  index={index}
                  centerIndex={iconCenterIndex}
                  scrollYProgress={smoothProgress}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATIC BENTO PHASES SECTION (Positioned adjacent to prevent any overlapping!) */}
      <section className="phases-section" style={{ position: "relative", zIndex: 10 }}>
        <style dangerouslySetInnerHTML={{__html: `
          .phases-section {
            padding: 6rem 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .phases-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            width: 100%;
          }
          .phase-card-wrapper {
            display: flex;
          }
          .phase-card {
            background: rgba(32, 31, 30, 0.45);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: var(--radius);
            padding: 2rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            transition: border-color 0.3s ease, background 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            width: 100%;
            height: 100%;
          }
          .phase-card:hover {
            border-color: var(--accent);
            background: rgba(40, 39, 38, 0.65);
          }
          html.light .phase-card {
            background: rgba(255, 255, 255, 0.5);
            border-color: rgba(0, 0, 0, 0.06);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.03);
          }
          html.light .phase-card:hover {
            border-color: var(--accent);
            background: rgba(255, 255, 255, 0.8);
          }
          @media (min-width: 768px) {
            .phases-grid {
              grid-template-columns: repeat(6, 1fr);
            }
            .phase-card-wrapper.p1, .phase-card-wrapper.p2, .phase-card-wrapper.p3 {
              grid-column: span 2;
            }
            .phase-card-wrapper.p4, .phase-card-wrapper.p5 {
              grid-column: span 3;
            }
          }
        `}} />

        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-label">Execution Strategy</span>
          <h3 className="section-heading" style={{ fontSize: "2rem", margin: "0.5rem 0", color: "var(--fg-1)" }}>
            Implementation Timeline
          </h3>
          <p className="section-desc">Five distinct phases designed for robust platform deployment.</p>
        </div>

        <StickyPhasesTimeline phases={phases} isMobile={isMobile} />
      </section>
    </>
  );
}
