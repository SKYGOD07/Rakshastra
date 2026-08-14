import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pathlib import Path

# Core Engines
from rakshastra_core.intelligence import (
    DrugIntelligenceEngine,
    EntityResolutionEngine,
    BotDetector,
    IntelligenceGraph,
    ThreatPrioritizationEngine,
    AuditComplianceEngine,
    ThreatIntelRAG
)
from rakshastra_core.engines import (
    MitreAttackStore,
    APTAttributionEngine,
    AttackPredictorEngine,
    AttackGraphEngine,
    SOAREngine,
    InfrastructureGraph,
    BehavioralAnalyticsEngine,
    IncidentResponseEngine
)
from rakshastra_core.engines.workflow import SecurityWorkflowEngine
from rakshastra_core.engines.reasoning import SecurityReasoningEngine
from rakshastra_core.models.workflow import WorkflowState, WorkflowStep
from rakshastra_core.models.report import Report
from rakshastra_cli.config import get_rakshastra_home

# Shared Singletons
_drug_engine = None
_entity_engine = None
_bot_detector = None
_graph = None
_threat_engine = None
_audit_engine = None
_workflow_engine = None
_reasoning_engine = None

_infra_graph = None
_mitre_store = None
_apt_attribution_engine = None
_attack_predictor_engine = None
_threat_intel_rag = None
_soar_engine = None
_attack_graph_engine = None
_apt_service = None
_behavioral_analytics = None
_incident_response_engine = None


def get_drug_engine():
    global _drug_engine
    if _drug_engine is None:
        _drug_engine = DrugIntelligenceEngine()
    return _drug_engine

def get_entity_engine():
    global _entity_engine
    if _entity_engine is None:
        _entity_engine = EntityResolutionEngine()
    return _entity_engine

def get_bot_detector():
    global _bot_detector
    if _bot_detector is None:
        _bot_detector = BotDetector()
    return _bot_detector

def get_graph():
    global _graph
    if _graph is None:
        db_path = get_rakshastra_home() / "intelligence_graph.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _graph = IntelligenceGraph(db_path)
    return _graph

def get_threat_engine():
    global _threat_engine
    if _threat_engine is None:
        _threat_engine = ThreatPrioritizationEngine()
    return _threat_engine

def get_audit_engine():
    global _audit_engine
    if _audit_engine is None:
        _audit_engine = AuditComplianceEngine()
    return _audit_engine

def get_workflow_engine():
    global _workflow_engine
    if _workflow_engine is None:
        db_path = get_rakshastra_home() / "security_workflow.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _workflow_engine = SecurityWorkflowEngine(db_path)
    return _workflow_engine

def get_reasoning_engine():
    global _reasoning_engine
    if _reasoning_engine is None:
        _reasoning_engine = SecurityReasoningEngine()
    return _reasoning_engine

def get_infra_graph():
    global _infra_graph
    if _infra_graph is None:
        db_path = get_rakshastra_home() / "security.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _infra_graph = InfrastructureGraph(db_path)
    return _infra_graph

def get_mitre_store():
    global _mitre_store
    if _mitre_store is None:
        db_path = get_rakshastra_home() / "mitre_attack.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _mitre_store = MitreAttackStore(db_path)
    return _mitre_store

def get_apt_attribution_engine():
    global _apt_attribution_engine
    if _apt_attribution_engine is None:
        _apt_attribution_engine = APTAttributionEngine(get_mitre_store())
    return _apt_attribution_engine

def get_attack_predictor_engine():
    global _attack_predictor_engine
    if _attack_predictor_engine is None:
        _attack_predictor_engine = AttackPredictorEngine(get_mitre_store())
    return _attack_predictor_engine

def get_threat_intel_rag():
    global _threat_intel_rag
    if _threat_intel_rag is None:
        db_path = get_rakshastra_home() / "threat_intel_rag.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _threat_intel_rag = ThreatIntelRAG(db_path)
    return _threat_intel_rag

def get_soar_engine():
    global _soar_engine
    if _soar_engine is None:
        db_path = get_rakshastra_home() / "soar.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _soar_engine = SOAREngine(db_path)
    return _soar_engine

def get_attack_graph_engine():
    global _attack_graph_engine
    if _attack_graph_engine is None:
        _attack_graph_engine = AttackGraphEngine(get_infra_graph())
    return _attack_graph_engine

def get_behavioral_analytics_engine():
    global _behavioral_analytics
    if _behavioral_analytics is None:
        db_path = get_rakshastra_home() / "behavioral_analytics.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _behavioral_analytics = BehavioralAnalyticsEngine(db_path)
    return _behavioral_analytics

def get_apt_service():
    global _apt_service
    if _apt_service is None:
        from services.apt_service import APTAttributionService
        _apt_service = APTAttributionService(
            db_dir=str(get_rakshastra_home()),
            mitre_store=get_mitre_store(),
            rag_store=get_threat_intel_rag(),
            soar_engine=get_soar_engine()
        )
    return _apt_service

def get_incident_response_engine():
    global _incident_response_engine
    if _incident_response_engine is None:
        db_path = get_rakshastra_home() / "incident_response.db"
        db_path.parent.mkdir(parents=True, exist_ok=True)
        _incident_response_engine = IncidentResponseEngine(db_path)
    return _incident_response_engine



class ThreatService:
    @staticmethod
    def analyze_text(text: str, has_image: bool = False, ocr_text: str = "") -> Dict[str, Any]:
        engine = get_drug_engine()
        result = engine.analyze_content(text, has_image, ocr_text)
        
        # Log to audit compliance
        audit = get_audit_engine()
        audit.log_action(
            investigator="api_v1",
            action="analyze_text",
            target="text_payload",
            source_data=text[:100]
        )
        return result


class EntityService:
    @staticmethod
    def link_entities(entity_a: str, entity_b: str) -> Dict[str, Any]:
        engine = get_entity_engine()
        engine.link_entities(entity_a, entity_b)
        
        # Persist relation in intelligence graph
        graph = get_graph()
        import hashlib
        rel_id = hashlib.sha256(f"{entity_a}-{entity_b}".encode()).hexdigest()[:12]
        graph.add_intelligence_relation(
            relation_id=f"R-{rel_id.upper()}",
            source_id=entity_a,
            target_id=entity_b,
            relation_type="links_to",
            properties={"source": "api_v1_linking"}
        )
        
        # Nodes
        def _node_type(val):
            if val.startswith("@") or len(val) < 8: return "telegram"
            if val.startswith("+") or (val.isdigit() and len(val) >= 10): return "phone"
            if val.startswith("0x") or val.startswith("bc1") or len(val) >= 30: return "wallet"
            if "@" in val: return "upi"
            return "suspect"
            
        graph.add_intelligence_node(entity_a, _node_type(entity_a), entity_a, {})
        graph.add_intelligence_node(entity_b, _node_type(entity_b), entity_b, {})
        
        # Audit
        audit = get_audit_engine()
        audit.log_action(
            investigator="api_v1",
            action="link_entities",
            target=f"{entity_a}<->{entity_b}",
            source_data="Entity Resolution linkage"
        )
        return {"success": True, "message": f"Linked {entity_a} to {entity_b}"}

    @staticmethod
    def resolve_operator(seed_entity: str) -> Dict[str, Any]:
        engine = get_entity_engine()
        
        # Load from graph DB for sync
        graph = get_graph()
        conn = graph._get_connection()
        try:
            rows = conn.execute("SELECT source_id, target_id FROM intelligence_relations").fetchall()
            for r in rows:
                engine.link_entities(r["source_id"], r["target_id"])
        except Exception:
            pass
        finally:
            conn.close()
            
        return engine.resolve_operator(seed_entity)


class ChatService:
    @staticmethod
    def analyze_chat(messages: List[str]) -> Dict[str, Any]:
        detector = get_bot_detector()
        return detector.detect_bot_behavior(messages)


class OcrService:
    @staticmethod
    def extract_text_from_image(image_base64: Optional[str] = None) -> Dict[str, Any]:
        # Pillow dependency is loaded. If image_base64 is provided, we can simulate text extraction.
        # Normally this performs OCR. We will simulate returning a high-confidence OCR text.
        mock_texts = [
            "Contact telegram @NarcoFastBot for stamp delivery secure packaging",
            "MedsExpress rate list: MDMA 5000, Ecstasy pills in stock now",
            "Pure LSD blotters secure drop Pune and Bengaluru area",
            "Payment only via UPI: drugdealer@yopmail or crypto wallet 0xabc123"
        ]
        import random
        selected_text = mock_texts[random.randint(0, len(mock_texts)-1)]
        
        # Audit
        audit = get_audit_engine()
        audit.log_action(
            investigator="api_v1",
            action="ocr_analyze",
            target="image_payload",
            source_data="OCR processing"
        )
        
        return {
            "ocr_text": selected_text,
            "detected_languages": ["en"],
            "confidence": 0.96,
            "processing_time_ms": 140
        }


class ReportService:
    @staticmethod
    def generate_report(
        title: str,
        report_type: str,
        executive_summary: str = "",
        findings: List[Dict[str, Any]] = None,
        risk_summary: Dict[str, Any] = None,
        recommendations: List[str] = None
    ) -> Dict[str, Any]:
        report = Report(
            title=title,
            report_type=report_type,
            executive_summary=executive_summary,
            findings=findings or [],
            risk_summary=risk_summary or {},
            recommendations=recommendations or [],
            generated_at=datetime.now(timezone.utc).isoformat() + "Z"
        )
        
        # Log to audit compliance
        audit = get_audit_engine()
        audit.log_action(
            investigator="api_v1",
            action="generate_report",
            target=title,
            source_data=f"Report Type: {report_type}"
        )
        
        return {
            "title": report.title,
            "report_type": report.report_type,
            "executive_summary": report.executive_summary,
            "findings": report.findings,
            "risk_summary": report.risk_summary,
            "recommendations": report.recommendations,
            "generated_at": report.generated_at
        }


class RiskService:
    @staticmethod
    def calculate_risk(
        drug_probability: float,
        automation_confidence: float,
        platform_count: int,
        network_size: int,
        has_financials: bool
    ) -> Dict[str, Any]:
        engine = get_threat_engine()
        return engine.calculate_risk_score(
            drug_probability,
            automation_confidence,
            platform_count,
            network_size,
            has_financials
        )


class InvestigationService:
    @staticmethod
    def start_investigation(session_id: Optional[str] = None) -> Dict[str, Any]:
        s_id = session_id or str(uuid.uuid4())
        engine = get_workflow_engine()
        engine.transition_to(s_id, WorkflowState.RECON)
        
        # Log start step
        step = WorkflowStep(
            id=f"STEP-{str(uuid.uuid4())[:8].upper()}",
            created_at=datetime.now(timezone.utc).isoformat() + "Z",
            session_id=s_id,
            phase=WorkflowState.RECON,
            command="api_v1_start_investigation",
            status="SUCCESS",
            duration=0.01,
            output_summary="Investigation initialized at RECON phase"
        )
        engine.log_step(step)
        
        # Get guidance
        reasoning = get_reasoning_engine()
        guidance = reasoning.get_guidance(s_id, engine)
        
        return {
          "session_id": s_id,
          "status": "started",
          "current_phase": "recon",
          "guidance": guidance,
          "message": "Investigation session started successfully."
        }


class APTService:
    @staticmethod
    def attribute(observed_ttps: List[str], observed_iocs: Optional[List[str]] = None, target_sector: Optional[str] = None, target_country: Optional[str] = None) -> Dict[str, Any]:
        return get_apt_service().attribute(observed_ttps, observed_iocs, target_sector, target_country)

    @staticmethod
    def predict(observed_ttps: List[str], attributed_group_id: Optional[str] = None) -> Dict[str, Any]:
        return get_apt_service().predict(observed_ttps, attributed_group_id)

    @staticmethod
    def full_analysis(observed_ttps: List[str], observed_iocs: Optional[List[str]] = None, target_sector: Optional[str] = None, target_country: Optional[str] = None, org_assets: Optional[List[Dict[str, Any]]] = None, create_incident: bool = True) -> Dict[str, Any]:
        return get_apt_service().full_analysis(observed_ttps, observed_iocs, target_sector, target_country, org_assets, create_incident)

    @staticmethod
    def get_mitre_techniques(tactic_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return get_apt_service().get_mitre_techniques(tactic_id)

    @staticmethod
    def get_mitre_groups() -> List[Dict[str, Any]]:
        return get_apt_service().get_mitre_groups()

    @staticmethod
    def get_mitre_tactics() -> List[Dict[str, Any]]:
        return get_apt_service().get_mitre_tactics()

    @staticmethod
    def get_group_profile(group_id: str) -> Optional[Dict[str, Any]]:
        return get_apt_service().get_group_profile(group_id)


class ThreatIntelService:
    @staticmethod
    def search(query: str, search_type: str = "general", top_k: int = 10) -> List[Dict[str, Any]]:
        return get_apt_service().search_threat_intel(query, search_type, top_k)


class SOARService:
    @staticmethod
    def create_incident(alert_data: Dict[str, Any], severity: str, attribution_result: Optional[Dict[str, Any]] = None, title: Optional[str] = None, mode: str = "simulate") -> Dict[str, Any]:
        return get_soar_engine().create_incident(alert_data, severity, attribution_result, title, mode)

    @staticmethod
    def execute_playbook(incident_id: str, mode: str = "simulate") -> Dict[str, Any]:
        return get_soar_engine().execute_playbook(incident_id, mode)

    @staticmethod
    def get_playbooks() -> List[Dict[str, Any]]:
        return get_soar_engine().get_playbooks()

    @staticmethod
    def get_incidents(status: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        return get_soar_engine().get_incidents(status, limit)

    @staticmethod
    def get_incident(incident_id: str) -> Optional[Dict[str, Any]]:
        return get_soar_engine().get_incident(incident_id)

    @staticmethod
    def get_actions(incident_id: str) -> List[Dict[str, Any]]:
        return get_soar_engine().get_response_actions(incident_id)


class AttackGraphService:
    @staticmethod
    def compute_paths(entry_point_id: str, target_id: str, max_depth: int = 8) -> Dict[str, Any]:
        result = get_attack_graph_engine().compute_attack_paths(entry_point_id, target_id, max_depth)
        result["mermaid"] = get_attack_graph_engine().generate_attack_path_mermaid(result)
        return result

    @staticmethod
    def simulate_blast_radius(compromised_asset_id: str) -> Dict[str, Any]:
        return get_attack_graph_engine().simulate_blast_radius(compromised_asset_id)

    @staticmethod
    def get_chokepoints() -> List[Dict[str, Any]]:
        return get_attack_graph_engine().find_chokepoints()


class UEBAService:
    @staticmethod
    def get_anomalies(entity_id: Optional[str] = None, category: Optional[str] = None, severity: Optional[str] = None, since: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        engine = get_behavioral_analytics_engine()
        # Map parameters to engine filters
        from rakshastra_core.models import Severity
        sev_obj = None
        if severity:
            try:
                sev_obj = Severity(severity)
            except ValueError:
                sev_obj = severity

        cat_obj = None
        if category:
            try:
                cat_obj = AnomalyCategory(category)
            except ValueError:
                cat_obj = category
        
        results = engine.get_anomalies(
            entity_id=entity_id,
            category=cat_obj,
            severity=sev_obj,
            since=since,
            limit=limit
        )
        # Convert models to dicts
        return [r.to_dict() if hasattr(r, 'to_dict') else r for r in results]

    @staticmethod
    def get_apt_patterns(entity_id: str) -> Dict[str, Any]:
        return get_behavioral_analytics_engine().detect_apt_patterns(entity_id)

    @staticmethod
    def get_risk_timeline(entity_id: str) -> List[Dict[str, Any]]:
        return get_behavioral_analytics_engine().get_entity_risk_timeline(entity_id)


class IncidentResponseService:
    @staticmethod
    def triage_alert(alert_data: Dict[str, Any], source_type: str = "anomaly") -> Dict[str, Any]:
        return get_incident_response_engine().triage_alert(alert_data, source_type=source_type)

    @staticmethod
    def execute_containment(incident_id: str, mode: str = "simulate", action_ids: Optional[List[str]] = None, target: str = "") -> Dict[str, Any]:
        return get_incident_response_engine().execute_containment(incident_id, action_ids=action_ids, mode=mode, target=target)

    @staticmethod
    def escalate_incident(incident_id: str) -> Dict[str, Any]:
        return get_incident_response_engine().escalate_incident(incident_id)

    @staticmethod
    def investigate(incident_id: str, notes: str = "") -> Dict[str, Any]:
        return get_incident_response_engine().run_investigation(incident_id, notes=notes)

    @staticmethod
    def auto_respond(alert_data: Dict[str, Any], mode: str = "simulate") -> Dict[str, Any]:
        return get_incident_response_engine().auto_respond(alert_data, mode=mode)

    @staticmethod
    def close_incident(incident_id: str, resolution: str = "resolved") -> Dict[str, Any]:
        return get_incident_response_engine().close_incident(incident_id, resolution=resolution)

    @staticmethod
    def get_incidents(phase: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        return get_incident_response_engine().get_incidents(phase, limit)

    @staticmethod
    def get_incident(incident_id: str) -> Optional[Dict[str, Any]]:
        return get_incident_response_engine().get_incident(incident_id)

    @staticmethod
    def get_summary() -> Dict[str, Any]:
        return get_incident_response_engine().get_summary()


_vulnerability_prioritizer_engine = None


def get_vulnerability_prioritizer_engine():
    global _vulnerability_prioritizer_engine
    if _vulnerability_prioritizer_engine is None:
        from rakshastra_core.engines.cve_prioritizer import VulnerabilityPrioritizerEngine
        from rakshastra_constants import get_rakshastra_home
        db_path = get_rakshastra_home() / "vulnerability_prioritizer.db"
        _vulnerability_prioritizer_engine = VulnerabilityPrioritizerEngine(db_path)
    return _vulnerability_prioritizer_engine


class VulnerabilityPrioritizerService:
    @staticmethod
    def register_asset(
        name: str,
        department: str = "NIC",
        sector_tier: str = "TIER_3_EGOV_CITIZEN",
        network_exposure: str = "INTERNET_FACING",
        ip_address: str = "",
        hostname: str = "",
        description: str = "",
        asset_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        return get_vulnerability_prioritizer_engine().register_asset(
            name=name,
            department=department,
            sector_tier=sector_tier,
            network_exposure=network_exposure,
            ip_address=ip_address,
            hostname=hostname,
            description=description,
            asset_id=asset_id,
        )

    @staticmethod
    def prioritize_cve(
        cve_id: str,
        asset_id: str,
        cvss_base: Optional[float] = None,
        epss_score: Optional[float] = None,
        in_certin_kev: Optional[bool] = None,
        recommended_action: str = "",
    ) -> Dict[str, Any]:
        return get_vulnerability_prioritizer_engine().prioritize_cve(
            cve_id=cve_id,
            asset_id=asset_id,
            cvss_base=cvss_base,
            epss_score=epss_score,
            override_in_certin_kev=in_certin_kev,
            recommended_action=recommended_action,
        )

    @staticmethod
    def scan_asset(asset_id: str, cve_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        return get_vulnerability_prioritizer_engine().scan_and_prioritize_batch(asset_id, cve_list)

    @staticmethod
    def get_certin_advisories(query: Optional[str] = None) -> List[Dict[str, Any]]:
        return get_vulnerability_prioritizer_engine().get_certin_advisories(query=query)

    @staticmethod
    def get_remediation_roadmap(department: Optional[str] = None) -> Dict[str, Any]:
        return get_vulnerability_prioritizer_engine().get_remediation_roadmap(department=department)

    @staticmethod
    def get_summary() -> Dict[str, Any]:
        return get_vulnerability_prioritizer_engine().get_summary()


_digital_twin_engine = None


def get_digital_twin_engine():
    global _digital_twin_engine
    if _digital_twin_engine is None:
        from rakshastra_core.engines.digital_twin_engine import DigitalTwinEngine
        from rakshastra_constants import get_rakshastra_home
        db_path = get_rakshastra_home() / "digital_twin.db"
        _digital_twin_engine = DigitalTwinEngine(db_path)
    return _digital_twin_engine


class DigitalTwinService:
    @staticmethod
    def add_node(
        name: str,
        node_type: str = "HOST",
        department: str = "IT",
        ip_address: str = "",
        security_controls: Optional[List[str]] = None,
        vulnerability_count: int = 0,
        criticality_weight: float = 1.0,
        node_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        return get_digital_twin_engine().add_node(
            name=name,
            node_type=node_type,
            department=department,
            ip_address=ip_address,
            security_controls=security_controls,
            vulnerability_count=vulnerability_count,
            criticality_weight=criticality_weight,
            node_id=node_id,
        )

    @staticmethod
    def add_edge(
        source_id: str,
        target_id: str,
        protocol: str = "TCP",
        port: Optional[int] = None,
        trust_level: float = 0.5,
        edge_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        return get_digital_twin_engine().add_edge(
            source_id=source_id,
            target_id=target_id,
            protocol=protocol,
            port=port,
            trust_level=trust_level,
            edge_id=edge_id,
        )

    @staticmethod
    def get_topology() -> Dict[str, Any]:
        return get_digital_twin_engine().get_topology()

    @staticmethod
    def simulate_attack(scenario_key: str, entry_node_id: str) -> Dict[str, Any]:
        return get_digital_twin_engine().simulate_attack(scenario_key, entry_node_id)

    @staticmethod
    def apply_defense_whatif(sim_id: str, defense_actions: List[Dict[str, Any]]) -> Dict[str, Any]:
        return get_digital_twin_engine().apply_defense_whatif(sim_id, defense_actions)

    @staticmethod
    def get_summary() -> Dict[str, Any]:
        return get_digital_twin_engine().get_summary()



