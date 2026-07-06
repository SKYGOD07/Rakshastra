"use client";

import React from "react";
import Link from "next/link";
import { Magnetic } from "./Magnetic";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Magnetic>
          <span className="logo" style={{ fontSize: '1rem', cursor: 'default', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/logo.png" alt="Rakshastra Logo" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            Rakshastra
          </span>
        </Magnetic>

        <div className="footer-links">
          <Magnetic>
            <a href="#" className="footer-link">GitHub</a>
          </Magnetic>
          <Magnetic>
            <Link href="/docs" className="footer-link">Docs</Link>
          </Magnetic>
          <Magnetic>
            <Link href="/privacy" className="footer-link">Privacy</Link>
          </Magnetic>
          <Magnetic>
            <Link href="/license" className="footer-link">License</Link>
          </Magnetic>
        </div>

        <Magnetic>
          <span className="footer-copy" style={{ cursor: 'default' }}>
            &copy; {new Date().getFullYear()} Rakshastra Project
          </span>
        </Magnetic>
      </div>
    </footer>
  );
}

