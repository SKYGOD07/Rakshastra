"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  platform: "Telegram" | "WhatsApp" | "Instagram" | "Darknet";
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  status: "active" | "flagged" | "intercepted";
  pulse: number;
}

const PLATFORM_COLORS = {
  Telegram: "#33b3f1", // Sky Blue
  WhatsApp: "#8dff55", // Green
  Instagram: "#e962bf", // Pink/Magenta
  Darknet: "#ff4b4b", // Red
};

interface InteractiveThreatVisualizerProps {
  borderless?: boolean;
}

export default function InteractiveThreatVisualizer({ borderless = false }: InteractiveThreatVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [interceptionProgress, setInterceptionProgress] = useState(0);
  const [interceptionStatus, setInterceptionStatus] = useState("");

  const nodesRef = useRef<Node[]>([]);
  const isInterceptingRef = useRef(false);

  const telegramImgRef = useRef<HTMLImageElement | null>(null);
  const whatsappImgRef = useRef<HTMLImageElement | null>(null);
  const instagramImgRef = useRef<HTMLImageElement | null>(null);

  // Pre-load platform images
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tgImg = new Image();
    tgImg.src = "/telegram.png";
    tgImg.onload = () => {
      telegramImgRef.current = tgImg;
    };

    const waImg = new Image();
    waImg.src = "/whatsapp.png";
    waImg.onload = () => {
      whatsappImgRef.current = waImg;
    };

    const igImg = new Image();
    igImg.src = "/instagram.png";
    igImg.onload = () => {
      instagramImgRef.current = igImg;
    };
  }, []);

  // Initialize nodes
  useEffect(() => {
    const nodes: Node[] = [];
    const platforms: ("Telegram" | "WhatsApp" | "Instagram")[] = [
      "Telegram", "WhatsApp", "Instagram"
    ];
    const labels = [
      "@SpeedyNarcotics", "Group-409X", "DropLocation_01",
      "@NeoMeds", "Channel_Private", "HashEndpoint", "InstaVibes", "VendorProfile_X"
    ];

    for (let i = 0; i < 8; i++) {
      const platform = platforms[i % platforms.length];
      let x = 0;
      let y = 0;
      let isOverlap = true;
      let attempts = 0;
      
      // Ensure initial positions are spaced out by at least 70px
      while (isOverlap && attempts < 100) {
        x = Math.random() * 200 + 80;
        y = Math.random() * 180 + 80;
        isOverlap = false;
        attempts++;
        for (let j = 0; j < nodes.length; j++) {
          const dist = Math.sqrt((nodes[j].x - x) ** 2 + (nodes[j].y - y) ** 2);
          if (dist < 70) {
            isOverlap = true;
            break;
          }
        }
      }

      nodes.push({
        id: `node-${i}`,
        label: labels[i % labels.length],
        platform,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 3 + 8, // slightly larger nodes for better logo visibility
        color: PLATFORM_COLORS[platform],
        status: "active",
        pulse: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let time = 0;
    const ctx = canvas.getContext("2d");
    let radarGrad: CanvasGradient | null = null;

    const resize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = container.offsetHeight || 380;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      if (ctx) {
        ctx.scale(dpr, dpr);
        // Pre-create and cache the gradient to avoid allocation in draw loop
        radarGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(w, h) * 0.5);
        radarGrad.addColorStop(0, "rgba(255, 125, 54, 0.08)");
        radarGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      time += 0.01;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw radar sweep background lines
      ctx.strokeStyle = "rgba(112, 109, 106, 0.08)";
      ctx.lineWidth = 1;
      
      // Concentric circles
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Axis lines
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Sweeping radar beam
      if (radarGrad) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(time * 0.8);
        ctx.fillStyle = radarGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, Math.min(w, h) * 0.5, -0.2, 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 2. Update and draw links between nodes
      const nodes = nodesRef.current;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");
            ctx.strokeStyle = isLight ? `rgba(80, 77, 74, ${alpha})` : `rgba(213, 211, 209, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Resolve node-to-node collisions to prevent overlaps (text and graphics)
      const minDist = 65; // minimum distance to prevent overlaps
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < minDist) {
            const overlap = minDist - dist;
            const forceX = (dx / (dist || 1)) * (overlap / 2);
            const forceY = (dy / (dist || 1)) * (overlap / 2);
            
            n1.x -= forceX;
            n1.y -= forceY;
            n2.x += forceX;
            n2.y += forceY;
            
            // Exchange velocities (elastic bounce)
            const tempVx = n1.vx;
            const tempVy = n1.vy;
            n1.vx = n2.vx;
            n1.vy = n2.vy;
            n2.vx = tempVx;
            n2.vy = tempVy;
          }
        }
      }

      // 3. Update, clamp boundaries, and draw nodes (optimized standard for-loop to avoid closures)
      const len = nodes.length;
      for (let k = 0; k < len; k++) {
        const node = nodes[k];
        // Apply physics
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.05;

        // Boundary bounce & clamping (ensures node stays inside visible canvas)
        if (node.x < 35) {
          node.x = 35;
          node.vx = Math.abs(node.vx);
        } else if (node.x > w - 35) {
          node.x = w - 35;
          node.vx = -Math.abs(node.vx);
        }
        if (node.y < 35) {
          node.y = 35;
          node.vy = Math.abs(node.vy);
        } else if (node.y > h - 35) {
          node.y = h - 35;
          node.vy = -Math.abs(node.vy);
        }

        // Draw node pulse glow
        const glowRad = node.radius + Math.sin(node.pulse) * 4;
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Node center image or backup colored circle
        let img: HTMLImageElement | null = null;
        if (node.platform === "Telegram") img = telegramImgRef.current;
        else if (node.platform === "WhatsApp") img = whatsappImgRef.current;
        else if (node.platform === "Instagram") img = instagramImgRef.current;

        if (img) {
          // Draw a background circle for contrast and hover glow
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = "rgba(15, 17, 21, 0.9)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = node.status === "intercepted" ? "#28c840" : node.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.stroke();

          // Draw the image logo inside
          ctx.globalAlpha = 1;
          const size = (node.radius + 2) * 2;
          ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
        } else {
          ctx.globalAlpha = 1;
          ctx.fillStyle = node.status === "intercepted" ? "#28c840" : node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node label
        const isLight = typeof document !== "undefined" && document.documentElement.classList.contains("light");
        ctx.fillStyle = isLight ? "#504d4a" : "#a09d9a";
        ctx.font = "10px var(--font-mono)";
        ctx.textAlign = "center";
        ctx.fillText(`${node.label}`, node.x, node.y - node.radius - 10);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Handle canvas clicks to intercept node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isInterceptingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodesRef.current.find((node) => {
      const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
      return dist < node.radius + 15; // padding for easy clicking
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      isInterceptingRef.current = true;
      setInterceptionProgress(0);
      setInterceptionStatus("INITIALIZING STEALTH TAP...");

      let prog = 0;
      const interval = setInterval(() => {
        prog += 5;
        setInterceptionProgress(prog);

        if (prog === 25) setInterceptionStatus("EXTRACTING METADATA & IP...");
        if (prog === 50) setInterceptionStatus("RUNNING NLP ON CONVERSATIONS...");
        if (prog === 75) setInterceptionStatus("TRIANGULATING GPS...");
        
        if (prog >= 100) {
          clearInterval(interval);
          clickedNode.status = "intercepted";
          setInterceptionStatus("THREAT PACKET DISPATCHED TO LEA!");
          setTimeout(() => {
            setSelectedNode(null);
            isInterceptingRef.current = false;
          }, 2000);
        }
      }, 150);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "380px",
        background: borderless ? "transparent" : "var(--bg-2)",
        borderRadius: "var(--radius)",
        border: borderless ? "none" : "1px solid var(--bg-4)",
        overflow: "hidden",
        boxShadow: borderless ? "none" : "0 10px 30px rgba(0,0,0,0.3)"
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
      />

      {/* Floating HUD Instructions */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          pointerEvents: "none",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--fg-4)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <span style={{ color: "var(--accent)" }}>&gt; NET_VISUALIZER // MULTI_PLATFORM</span>
        <span>STATUS: ACTIVE SCANNING</span>
        <span>TARGETS DETECTED: {nodesRef.current.length}</span>
        <span style={{ marginTop: "4px", color: "var(--fg-3)" }}>[CLICK A NODE TO INFILTRATE]</span>
      </div>

      {/* Interception Overlay */}
      {selectedNode && (
        <div className="interception-overlay">
          <div style={{ color: selectedNode.color, fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>
            INFILTRATING {selectedNode.label}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--fg-3)", marginBottom: "15px" }}>
            Source: {selectedNode.platform} | Status: {selectedNode.status.toUpperCase()}
          </div>

          <div
            style={{
              width: "80%",
              height: "4px",
              background: "var(--bg-5)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: `${interceptionProgress}%`,
                height: "100%",
                background: selectedNode.color,
                transition: "width 0.15s ease",
              }}
            />
          </div>

          <div style={{ fontSize: "0.75rem", color: interceptionProgress >= 100 ? "var(--green)" : "var(--fg-2)", letterSpacing: "1px" }}>
            {interceptionStatus}
          </div>
        </div>
      )}
    </div>
  );
}
