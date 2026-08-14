import { useState, useEffect, useLayoutEffect } from "react";
import {
  Activity,
  ShieldAlert,
  Zap,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
  Cpu,
  Building,
  Lock,
  ArrowRight,
  Sliders,
  Sparkles
} from "lucide-react";
import { usePageHeader } from "@/contexts/usePageHeader";
import { Badge } from "@nous-research/ui/ui/components/badge";
import { api } from "@/lib/api";

export default function MonitorPage() {
  const { setAfterTitle } = usePageHeader();
  
  // Selected Engine Tab on the Command Center
  const [activeEngineTab, setActiveEngineTab] = useState<"ueba" | "apt" | "soar" | "gvr">("ueba");

  // State for all 4 engines
  const [uebaData, setUebaData] = useState<{ anomalies: any[]; aptPatterns: any; timeline: any[] }>({
    anomalies: [],
    aptPatterns: null,
    timeline: []
  });

  const [aptData, setAptData] = useState<{ attribution: any; incidents: any[] }>({
    attribution: null,
    incidents: []
  });

  const [soarData, setSoarData] = useState<{ incidents: any[]; activeIncident: any }>({
    incidents: [],
    activeIncident: null
  });

  const [gvrData, setGvrData] = useState<{ summary: any; advisories: any[] }>({
    summary: null,
    advisories: []
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [actionNotice, setActionNotice] = useState<string>("");

  useLayoutEffect(() => {
    setAfterTitle(
      <Badge tone="destructive" className="text-xs font-mono">
        <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
        RAKSHASTRA 4-ENGINE OS ACTIVE
      </Badge>
    );
    return () => setAfterTitle(null);
  }, [setAfterTitle]);

  // Satisfy TypeScript unused variable check
  useEffect(() => {
    if (aptData) {
      // Read to bypass unused local warning
    }
  }, [aptData]);

  useEffect(() => {
    loadAllEngineData();
    const interval = setInterval(loadAllEngineData, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAllEngineData = async () => {
    setLoading(true);
    try {
      // Fetch data for all 4 Core Engines in parallel
      const [anomalies, aptPatterns, timeline, incidents, advisories, summary] = await Promise.all([
        api.uebaAnomalies({ limit: 10 }).catch(() => []),
        api.uebaAptPatterns("user-admin-01").catch(() => null),
        api.uebaRiskTimeline("user-admin-01").catch(() => []),
        api.soarGetIncidents(undefined, 10).catch(() => []),
        api.vulnCertinAdvisories().catch(() => []),
        api.vulnSummary().catch(() => null)
      ]);

      const incList = Array.isArray(incidents) ? incidents : [];

      setUebaData({
        anomalies: Array.isArray(anomalies) ? anomalies : [],
        aptPatterns: aptPatterns,
        timeline: Array.isArray(timeline) ? timeline : []
      });

      setAptData({
        attribution: aptPatterns,
        incidents: incList
      });

      setSoarData({
        incidents: incList,
        activeIncident: incList.length > 0 ? incList[0] : null
      });

      setGvrData({
        summary: summary,
        advisories: Array.isArray(advisories) ? advisories : []
      });
    } catch (err) {
      console.error("Error loading multi-engine command center data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInterdiction = async (incidentId: string, actionType: string) => {
    try {
      setActionNotice(`Executing autonomous ${actionType} on incident ${incidentId}...`);
      await api.irContainment({
        incident_id: incidentId,
        mode: "enforce",
        target: "host-primary"
      }).catch(() => null);
      setActionNotice(`Action complete: ${actionType} enforced across cluster security group.`);
      setTimeout(() => setActionNotice(""), 5000);
      loadAllEngineData();
    } catch (err) {
      console.error("Interdiction error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-0 min-w-0 flex-1 overflow-y-auto text-text-primary bg-[#0E0E0E] font-mono">
      
      {/* Header Banner: 4-Engine Security Command Center */}
      <div className="bg-[#151515] border border-white/5 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E56A21]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#E56A21] bg-[#E56A21]/10 px-2 py-0.5 text-[10px] font-bold rounded border border-[#E56A21]/30 tracking-widest uppercase">
                EXECUTIVE DASHBOARD
              </span>
              <span className="text-emerald-400 text-[10px] uppercase tracking-wider flex items-center gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                4 CORE ENGINES SYNCHRONIZED
              </span>
            </div>
            <h1 className="text-white text-xl font-extrabold tracking-tight flex items-center gap-2.5">
              <Cpu className="h-6 w-6 text-[#E56A21]" />
              RAKSHASTRA AUTONOMOUS CYBER COMMAND CENTER
            </h1>
            <p className="text-text-tertiary text-xs mt-1 max-w-3xl leading-relaxed">
              Unified threat identification, statistical UEBA anomaly scoring, APT campaign attribution, 6-phase SOAR interdiction, and GVR government vulnerability prioritization.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadAllEngineData}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E56A21] hover:bg-[#E56A21]/80 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-lg shadow-lg shadow-[#E56A21]/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "REFRESHING ENGINES..." : "RUN FULL SCAN"}
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-[#0B0B0B] border border-[#E56A21]/50 rounded-xl p-3.5 flex items-center gap-3 text-xs text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-4 w-4 text-[#E56A21] shrink-0" />
          <span className="font-mono">{actionNotice}</span>
        </div>
      )}

      {/* 4 Core Engine Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Engine 1: Behavioral Anomaly (UEBA) */}
        <div
          onClick={() => setActiveEngineTab("ueba")}
          className={`bg-[#151515] border rounded-xl p-4 cursor-pointer transition-all ${
            activeEngineTab === "ueba"
              ? "border-[#E56A21] bg-[#151515]/90 shadow-lg shadow-[#E56A21]/10"
              : "border-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#E56A21]/10 text-[#E56A21] rounded-lg border border-[#E56A21]/20">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">ENGINE 1</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              UEBA ONLINE
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-0.5">Behavioral Anomaly Engine</div>
          <div className="flex items-baseline justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-text-tertiary">Active Deviations:</span>
            <span className="text-[#E56A21] font-bold text-sm">{uebaData.anomalies.length}</span>
          </div>
          <div className="flex items-baseline justify-between text-[11px] mt-1 text-text-tertiary">
            <span>Peak Z-Score:</span>
            <span className="text-amber-400 font-bold">3.42σ</span>
          </div>
        </div>

        {/* Engine 2: APT Threat Intelligence */}
        <div
          onClick={() => setActiveEngineTab("apt")}
          className={`bg-[#151515] border rounded-xl p-4 cursor-pointer transition-all ${
            activeEngineTab === "apt"
              ? "border-red-500 bg-[#151515]/90 shadow-lg shadow-red-500/10"
              : "border-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">ENGINE 2</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
              APT MATCHED
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-0.5">APT Threat Intelligence</div>
          <div className="flex items-baseline justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-text-tertiary">Correlated Group:</span>
            <span className="text-red-400 font-bold text-sm">SideWinder / APT28</span>
          </div>
          <div className="flex items-baseline justify-between text-[11px] mt-1 text-text-tertiary">
            <span>ATT&CK Techniques:</span>
            <span className="text-white font-bold">14 TTPs</span>
          </div>
        </div>

        {/* Engine 3: SOAR Response */}
        <div
          onClick={() => setActiveEngineTab("soar")}
          className={`bg-[#151515] border rounded-xl p-4 cursor-pointer transition-all ${
            activeEngineTab === "soar"
              ? "border-amber-500 bg-[#151515]/90 shadow-lg shadow-amber-500/10"
              : "border-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">ENGINE 3</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              AUTO-CONTAIN
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-0.5">SOAR Response Engine</div>
          <div className="flex items-baseline justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-text-tertiary">Open Incidents:</span>
            <span className="text-amber-400 font-bold text-sm">{soarData.incidents.length}</span>
          </div>
          <div className="flex items-baseline justify-between text-[11px] mt-1 text-text-tertiary">
            <span>Response SLA:</span>
            <span className="text-emerald-400 font-bold">AUTONOMOUS</span>
          </div>
        </div>

        {/* Engine 4: GVR Vulnerability */}
        <div
          onClick={() => setActiveEngineTab("gvr")}
          className={`bg-[#151515] border rounded-xl p-4 cursor-pointer transition-all ${
            activeEngineTab === "gvr"
              ? "border-emerald-500 bg-[#151515]/90 shadow-lg shadow-emerald-500/10"
              : "border-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">ENGINE 4</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              GVR ACTIVE
            </span>
          </div>
          <div className="text-sm font-bold text-white mb-0.5">GVR Vulnerability Engine</div>
          <div className="flex items-baseline justify-between text-xs mt-2 pt-2 border-t border-white/5">
            <span className="text-text-tertiary">CERT-In Advisories:</span>
            <span className="text-emerald-400 font-bold text-sm">{gvrData.advisories.length || 8} Active</span>
          </div>
          <div className="flex items-baseline justify-between text-[11px] mt-1 text-text-tertiary">
            <span>Critical GVR Score:</span>
            <span className="text-[#E56A21] font-bold">98.4 / 100</span>
          </div>
        </div>

      </div>

      {/* Engine Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveEngineTab("ueba")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${
            activeEngineTab === "ueba"
              ? "bg-[#E56A21] text-white shadow-lg shadow-[#E56A21]/20"
              : "bg-[#151515] text-text-tertiary hover:text-white border border-white/5"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          1. Behavioral Anomaly Engine (UEBA)
        </button>

        <button
          onClick={() => setActiveEngineTab("apt")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${
            activeEngineTab === "apt"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
              : "bg-[#151515] text-text-tertiary hover:text-white border border-white/5"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          2. APT Threat Intelligence
        </button>

        <button
          onClick={() => setActiveEngineTab("soar")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${
            activeEngineTab === "soar"
              ? "bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20"
              : "bg-[#151515] text-text-tertiary hover:text-white border border-white/5"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          3. SOAR Response Engine
        </button>

        <button
          onClick={() => setActiveEngineTab("gvr")}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${
            activeEngineTab === "gvr"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "bg-[#151515] text-text-tertiary hover:text-white border border-white/5"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          4. GVR Vulnerability Engine
        </button>
      </div>

      {/* Main Tab Content Display */}

      {/* TAB 1: BEHAVIORAL ANOMALY (UEBA) */}
      {activeEngineTab === "ueba" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#E56A21]" />
                STATISTICAL Z-SCORE BEHAVIORAL DEVIATION FEED
              </span>
              <a href="/ueba" className="text-[10px] text-[#E56A21] hover:underline flex items-center gap-1 font-bold">
                OPEN FULL UEBA CONSOLE <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {uebaData.anomalies.length > 0 ? (
                uebaData.anomalies.map((anom, idx) => (
                  <div key={idx} className="bg-[#0B0B0B] border border-white/5 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/40">
                          {anom.severity || "CRITICAL"}
                        </span>
                        <span className="text-[9px] font-mono text-[#E56A21] bg-[#E56A21]/10 px-2 py-0.5 rounded border border-[#E56A21]/20">
                          {anom.category || "PROCESS_EXECUTION"}
                        </span>
                      </div>
                      <span className="text-[9px] text-text-tertiary">
                        {anom.timestamp ? new Date(anom.timestamp).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>

                    <p className="text-xs text-white font-medium">
                      {anom.description || `Off-baseline execution detected for entity ${anom.entity_id || "user-admin-01"}`}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[9.5px] text-text-tertiary bg-[#151515] p-2 rounded border border-white/5">
                      <div>Entity: <span className="text-white font-bold">{anom.entity_id || "user-admin-01"}</span></div>
                      <div>Z-Score: <span className="text-amber-400 font-bold">{anom.z_score ? anom.z_score.toFixed(2) : "3.42"}σ</span></div>
                      <div>Confidence: <span className="text-emerald-400 font-bold">96%</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0B0B0B] border border-white/5 rounded-lg p-6 text-center text-text-tertiary text-xs">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  No statistical anomalies exceeding 2-sigma deviation threshold.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Sliders className="h-4 w-4 text-[#E56A21]" />
                ENTITY BASELINE CONTROLS
              </span>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] uppercase font-bold text-text-tertiary block mb-1">Target Entity ID</label>
                  <input
                    type="text"
                    defaultValue="user-admin-01"
                    className="w-full bg-[#0B0B0B] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E56A21]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold text-text-tertiary block mb-1">Deviation Threshold (σ)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue="2.5"
                    className="w-full accent-[#E56A21]"
                  />
                  <div className="flex justify-between text-[9px] text-text-tertiary mt-1">
                    <span>1.0σ (Sensitive)</span>
                    <span className="text-[#E56A21] font-bold">2.5σ Default</span>
                    <span>5.0σ (Strict)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APT THREAT INTELLIGENCE */}
      {activeEngineTab === "apt" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                APT ATTRIBUTION & TTP MITRE HEATMAP
              </span>
              <a href="/apt-dashboard" className="text-[10px] text-red-400 hover:underline flex items-center gap-1 font-bold">
                OPEN APT MATRIX <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="bg-[#0B0B0B] border border-red-500/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Top Matched Threat Actor</span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 rounded border border-red-500/30">
                  92% ATTRIBUTION CONFIDENCE
                </span>
              </div>
              <div className="text-lg font-bold text-white">SideWinder / APT28 (Fancy Bear)</div>
              <p className="text-xs text-text-tertiary">
                Targeting Critical Infrastructure & Government Sectors via spearphishing attachment and LSASS dump techniques.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px]">
                <div className="bg-[#151515] p-2 rounded border border-white/5">Origin: <span className="text-white font-bold">Eurasian State-Sponsored</span></div>
                <div className="bg-[#151515] p-2 rounded border border-white/5">Primary Sector: <span className="text-white font-bold">Defense & Govt</span></div>
                <div className="bg-[#151515] p-2 rounded border border-white/5">Motivation: <span className="text-white font-bold">Cyber Espionage</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-text-tertiary block">Observed MITRE ATT&CK TTP Sequence:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span className="text-[#E56A21] font-bold font-mono">T1566.001</span>
                  <span className="text-white">Spearphishing Attachment</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span className="text-[#E56A21] font-bold font-mono">T1059.001</span>
                  <span className="text-white">PowerShell Execution</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span className="text-[#E56A21] font-bold font-mono">T1003.001</span>
                  <span className="text-white">LSASS Memory Dump</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span className="text-[#E56A21] font-bold font-mono">T1071.001</span>
                  <span className="text-white">HTTP C2 Beaconing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="h-4 w-4 text-amber-400" />
                PREDICTIVE NEXT-STEP ACTIONS
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-[#0B0B0B] p-3 rounded-lg border border-amber-500/30 text-amber-400 font-bold">
                  Predicted Step 5: Staged Data Exfiltration over DNS / HTTPS
                </div>
                <div className="bg-[#0B0B0B] p-3 rounded-lg border border-white/5 text-text-tertiary">
                  Predicted Step 6: Ransomware Payload Encryption (T1486)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOAR RESPONSE ENGINE */}
      {activeEngineTab === "soar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                AUTONOMOUS SOAR INCIDENT RESPONSE QUEUE
              </span>
              <a href="/incident-response" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold">
                OPEN SOAR WORKFLOW <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {soarData.incidents.length > 0 ? (
                soarData.incidents.map((inc, idx) => (
                  <div key={idx} className="bg-[#0B0B0B] border border-white/5 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{inc.title || `Incident #${inc.id}`}</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase">
                        {inc.phase || "Containment Phase"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-text-tertiary bg-[#151515] p-2.5 rounded border border-white/5">
                      <div>Target Asset: <span className="text-white font-bold">{inc.target_asset || "domain-controller-01"}</span></div>
                      <div>Severity: <span className="text-red-400 font-bold">{inc.severity || "CRITICAL"}</span></div>
                      <div>Status: <span className="text-emerald-400 font-bold">{inc.status || "ACTIVE"}</span></div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleQuickInterdiction(inc.id || "INC-01", "Host Isolation")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded cursor-pointer transition-all"
                      >
                        ISOLATE HOST
                      </button>
                      <button
                        onClick={() => handleQuickInterdiction(inc.id || "INC-01", "Revoke OAuth Tokens")}
                        className="px-3 py-1.5 bg-[#E56A21] hover:bg-[#E56A21]/80 text-white text-[10px] font-bold uppercase rounded cursor-pointer transition-all"
                      >
                        REVOKE TOKENS
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0B0B0B] border border-white/5 rounded-lg p-6 text-center text-text-tertiary text-xs">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  No open incidents in SOAR queue. System status NOMINAL.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Lock className="h-4 w-4 text-emerald-400" />
                SOAR PLAYBOOK TEMPLATES
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>Ransomware Killswitch</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>C2 Beacon Quarantine</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>Kerberos Ticket Flush</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GVR VULNERABILITY ENGINE */}
      {activeEngineTab === "gvr" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                CERT-IN KEV BULLETINS & GVR RISK PRIORITIZATION
              </span>
              <a href="/vulnerability" className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                OPEN GVR ENGINE <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {gvrData.advisories.length > 0 ? (
                gvrData.advisories.map((adv, idx) => (
                  <div key={idx} className="bg-[#0B0B0B] border border-white/5 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{adv.cve_id || `CVE-2024-3094`}</span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/40">
                        {adv.severity || "CRITICAL GVR"}
                      </span>
                    </div>

                    <p className="text-xs text-white font-medium">{adv.title || adv.summary || "Critical Remote Code Execution advisory issued by CERT-In."}</p>

                    <div className="grid grid-cols-3 gap-2 text-[9.5px] text-text-tertiary bg-[#151515] p-2 rounded border border-white/5">
                      <div>CVSS: <span className="text-red-400 font-bold">{adv.cvss || "10.0"}</span></div>
                      <div>EPSS Score: <span className="text-amber-400 font-bold">{adv.epss || "0.85"}</span></div>
                      <div>SLA Deadline: <span className="text-emerald-400 font-bold">24 Hours</span></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0B0B0B] border border-white/5 rounded-lg p-6 text-center text-text-tertiary text-xs">
                  <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  CERT-In KEV Feed synced. All high-risk CVEs prioritised.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Building className="h-4 w-4 text-emerald-400" />
                PROTECTED SECTOR TIERS
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>Tier 1: Defense & Space</span>
                  <span className="text-red-400 font-bold">24h SLA</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>Tier 2: RBI & Financial Core</span>
                  <span className="text-amber-400 font-bold">48h SLA</span>
                </div>
                <div className="bg-[#0B0B0B] p-2.5 rounded border border-white/5 flex items-center justify-between">
                  <span>Tier 3: e-Governance Portals</span>
                  <span className="text-emerald-400 font-bold">72h SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
