"use client";

import React, { useState, useEffect } from "react";

const downloadDetails = {
  windows: { name: "rakshastra_agent_win_x64.zip", size: "48 KB" },
  linux: { name: "rakshastra_agent_linux_x64.tar.gz", size: "34.2 MB" },
  macos: { name: "rakshastra_agent_mac_universal.dmg", size: "41.8 MB" },
};

export default function DownloadSection() {
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dlInfo, setDlInfo] = useState(downloadDetails.windows);
  const [status, setStatus] = useState("Connecting...");
  const [userOS, setUserOS] = useState<"windows" | "linux" | "macos">("windows");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setUserOS("macos");
    else if (ua.includes("linux")) setUserOS("linux");
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("curl -sS https://get.rakshastra.ai/install.sh | bash");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startDownload = (platform: "windows" | "linux" | "macos") => {
    const info = downloadDetails[platform];
    setDlInfo(info);
    setProgress(0);
    setStatus("Connecting...");
    setModal(true);

    const inc = 50 / 2000 * 100;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + inc;
        if (next >= 100) {
          clearInterval(id);
          setStatus("Download complete");
          // trigger real download
          const a = document.createElement("a");
          a.href = `/${info.name}`;
          a.download = info.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return 100;
        }
        if (next > 5 && next < 30) setStatus("Downloading agent core...");
        else if (next >= 30 && next < 80) setStatus(`Downloading (${Math.floor(next)}%)...`);
        else if (next >= 80) setStatus("Verifying signatures...");
        return next;
      });
    }, 50);

    (window as any).__dlInterval = id;
  };

  const closeModal = () => {
    setModal(false);
    if ((window as any).__dlInterval) clearInterval((window as any).__dlInterval);
  };

  return (
    <section className="section" id="download">
      <div className="anim-fade-up" style={{ marginBottom: '1rem' }}>
        <span className="section-label">Install</span>
        <h2 className="section-heading">Deploy the Agent</h2>
        <p className="section-desc">
          One command install, or download the binary for your platform.
        </p>
      </div>

      <div className="download-grid anim-fade-up anim-d2">
        {(["macos", "windows", "linux"] as const).map((platform) => (
          <div className={`download-card${userOS === platform ? " detected" : ""}`} key={platform} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '320px' }}>
            <div style={{ width: '100%' }}>
              <span className="download-platform-label">
                {platform === "macos" ? "MACOS 12+" : platform === "windows" ? "WINDOWS 10/11" : "ANY DISTRO"}
              </span>
              <h3 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
                {platform === "macos" ? "Mac OS" : platform === "windows" ? "Windows" : "Linux"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--fg-3)", marginBottom: "1.5rem", minHeight: "3rem" }}>
                {platform === "macos" ? "Native client for Apple Silicon." : platform === "windows" ? "Desktop GUI & crawler supervisor." : "Headless CLI agent for servers."}
              </p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => startDownload(platform)} 
              style={{ 
                width: '100%', 
                background: 'var(--fg-1)', 
                color: 'var(--bg-1)', 
                border: '1px solid rgba(0,0,0,0.1)', 
                boxShadow: 'none', 
                fontWeight: '600', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.78rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '0.6rem 1rem'
              }}
            >
              {platform === "macos" && (
                <svg className="mr-2" fill="currentColor" viewBox="0 0 24 24" style={{ width: "13px", height: "13px", marginRight: "8px" }}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.81.02 2.1-.56 2.82-1.33"/></svg>
              )}
              {platform === "windows" && (
                <svg className="mr-2" fill="currentColor" viewBox="0 0 24 24" style={{ width: "13px", height: "13px", marginRight: "8px" }}><path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zM10.95 12.45H24v11.55l-13.05-1.95v-9.6z"/></svg>
              )}
              {platform === "linux" && (
                <svg className="mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: "13px", height: "13px", marginRight: "8px" }}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              )}
              {platform === "linux" ? "INSTALL VIA TERMINAL" : "DOWNLOAD"}
            </button>
          </div>
        ))}
      </div>

      <div className="cli-box anim-fade-up anim-d3">
        <code>curl -sS https://get.rakshastra.ai/install.sh | bash</code>
        <button className="btn-secondary" onClick={handleCopy} style={{ whiteSpace: 'nowrap' }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ position: 'relative' }}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3>Downloading Agent</h3>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="modal-meta">
              <div>File: <span>{dlInfo.name}</span></div>
              <div>Size: <span>{dlInfo.size}</span></div>
              <div>Status: <span style={{ color: progress >= 100 ? "var(--accent-4)" : "var(--accent-2)" }}>{status}</span></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
