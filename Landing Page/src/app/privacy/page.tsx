import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="legal-page-container">
      <Link href="/" className="back-link">
        &larr; Back to Home
      </Link>

      <h1 className="legal-title">Privacy Statement</h1>
      <p className="legal-subtitle">Last Updated: July 5, 2026</p>

      <div className="legal-section">
        <h2>1. Local-First Architecture Commitment</h2>
        <p>
          Rakshastra is designed and built as a <strong>local-first, self-hosted autonomous agent</strong>. All data processing, log analysis, threat intelligence evaluations, and monitoring databases run entirely on your local infrastructure.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Zero Data Collection Policy</h2>
        <p>
          We do not collect, harvest, store, or transmit any personal information, security logs, asset graphs, or user identity data. There are no external databases, telemetry endpoints, or analytical trackers configured inside the Rakshastra core platform.
        </p>
      </div>

      <div className="legal-section">
        <h2>3. Security Logs and Local Storage</h2>
        <p>
          Any operational configurations, session databases, or telemetry metrics gathered by the local daemon are written solely to your local disk (typically within the <code>~/.rakshastra/</code> workspace directory). This information is never transmitted back to the authors or any third-party entities.
        </p>
      </div>

      <div className="legal-section">
        <h2>4. Open-Source Verification</h2>
        <p>
          As a project developed by student researchers and developers, the codebase is fully open-source. Operators are encouraged to audit, inspect, and verify the network behavior of the application directly from the public source repository.
        </p>
      </div>

      <div className="contact-box">
        <h3>Contact and False Positive Disclosures</h3>
        <p>
          If you have any questions regarding privacy boundaries, or if security utilities flag Rakshastra due to its local agent auditing capabilities, please contact the development team via the project repository channel.
        </p>
      </div>
    </div>
  );
}
