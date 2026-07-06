import React from "react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="legal-page-container">
      <Link href="/" className="back-link">
        &larr; Back to Home
      </Link>

      <h1 className="legal-title">Rakshastra Documentation</h1>
      <p className="legal-subtitle">Autonomous Cyber Defense Agent — Core Documentation</p>

      <div className="disclaimer-block">
        [ SYSTEM WARNING: CONFIDENTIAL OPERATIONAL MANUAL ]
This manual outlines the architectural boundaries and configuration guidelines for the Rakshastra (रक्षास्त्र) OSINT defense daemon. Authorized operators must comply with law enforcement coordination directives.
      </div>

      <div className="legal-section">
        <h2>1. System Architecture</h2>
        <p>
          Rakshastra is built on a modular three-tier autonomous agent loop designed for high-throughput social crawler ingestion:
        </p>
        <ul style={{ paddingLeft: "1.25rem", color: "var(--fg-2)", fontSize: "0.95rem", lineHeight: "1.75", marginTop: "0.5rem" }}>
          <li><strong>Hermes Ingestion Core:</strong> Manages stealth head-free browser loops, rotating proxies, and direct API listeners targeting Telegram channels, WhatsApp groups, and public Instagram feeds.</li>
          <li><strong>Gemini Pro LLM Engine:</strong> Conducts advanced NLP parsing, decrypting emojis and slang (e.g. mapping ❄️ to active illicit substance keywords) and evaluating semantic threat weights.</li>
          <li><strong>Neo4j Identity Graph:</strong> Connects disparate handles, location coordinates, phone numbers, and cryptocurrency wallets into unified, traceable threat actors.</li>
        </ul>
      </div>

      <div className="legal-section">
        <h2>2. Getting Started</h2>
        <p>
          Deploying a local instance of the Rakshastra agent requires a modern Node.js environment and active endpoints for graph processing.
        </p>
        
        <h3 style={{ fontSize: "1.1rem", color: "var(--fg-1)", marginTop: "1rem", marginBottom: "0.5rem" }}>Install Dependencies</h3>
        <div className="cli-box">
          <code>$ npm install @google/generative-ai neo4j-driver twilio dotenv</code>
        </div>

        <h3 style={{ fontSize: "1.1rem", color: "var(--fg-1)", marginTop: "1rem", marginBottom: "0.5rem" }}>Run local crawler daemon</h3>
        <div className="cli-box">
          <code>$ npm run agent -- --stream --visualize</code>
        </div>
      </div>

      <div className="legal-section">
        <h2>3. Environment Configuration</h2>
        <p>
          System parameters are read from a standard <code>.env</code> file in the application root directory. Essential keys include:
        </p>
        <pre style={{
          background: "var(--bg-2)",
          border: "1px solid var(--bg-4)",
          padding: "1rem",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--fg-2)",
          marginTop: "0.5rem",
          overflowX: "auto"
        }}>
{`# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Neo4j Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_secure_password

# Alert Dispatcher (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`}
        </pre>
      </div>

      <div className="legal-section">
        <h2>4. Stealth & Footprint Mitigation</h2>
        <p>
          To maintain anonymity while scraping illicit bot networks, Rakshastra routes active HTTP crawlers through a localized Tor control circuit.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          User agent headers are rotated every 15 minutes, mimicking mainstream mobile devices, and active requests employ jitter delays (100ms - 2500ms) to bypass standard anti-scraping triggers.
        </p>
      </div>

      <div className="contact-box" style={{ marginTop: "3rem" }}>
        <h3>Need Operational Support?</h3>
        <p>
          For setup assistance, custom regex rule contributions, or to report false positives, please log an issue on the repository page or consult the project developer channels.
        </p>
      </div>
    </div>
  );
}
