import React from "react";
import Link from "next/link";

export default function LicensePage() {
  return (
    <div className="legal-page-container">
      <Link href="/" className="back-link">
        &larr; Back to Home
      </Link>

      <h1 className="legal-title">License Terms</h1>
      <p className="legal-subtitle">Rakshastra Autonomous Cyber Defense Agent &mdash; Open-Source License</p>

      <div className="legal-section">
        <h2>1. Developer Grant &amp; License Agreement</h2>
        <p>
          The Rakshastra codebase, tools, TUI modules, and dashboard files are released under a highly permissive open-source license. Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
        </p>
      </div>

      <div className="legal-section">
        <h2>2. Disclaimer of Liability</h2>
        <pre className="disclaimer-block">
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </pre>
      </div>

      <div className="legal-section">
        <h2>3. Purpose and Scope</h2>
        <p>
          Rakshastra is built solely for educational demonstration, cyber defense modeling, and security testing. Operators are expected to run the daemon only on infrastructure they own or are explicitly authorized to audit.
        </p>
      </div>
    </div>
  );
}
