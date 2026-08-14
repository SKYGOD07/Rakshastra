"""Behavioural Anomaly Detection data models.

Defines the data structures used by the Behavioural Analytics Engine to
store baseline profiles and anomaly events for users, devices, and
network segments.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
from rakshastra_core.models.base import RakshastraModel, Severity, Confidence


class EntityType(str, Enum):
    """The kind of entity being profiled."""
    USER = "USER"
    DEVICE = "DEVICE"
    NETWORK_SEGMENT = "NETWORK_SEGMENT"
    PROCESS = "PROCESS"
    SERVICE = "SERVICE"


class AnomalyCategory(str, Enum):
    """High-level anomaly classification, mapped to MITRE ATT&CK tactics."""
    LOGIN_TIME = "LOGIN_TIME"               # Unusual login hour
    LOGIN_LOCATION = "LOGIN_LOCATION"       # Unusual source IP/geo
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION"
    LATERAL_MOVEMENT = "LATERAL_MOVEMENT"
    DATA_EXFILTRATION = "DATA_EXFILTRATION"  # Abnormal outbound data volume
    PROCESS_ANOMALY = "PROCESS_ANOMALY"     # Unusual process tree
    RESOURCE_ACCESS = "RESOURCE_ACCESS"     # Access to unusual file/share/DB
    NETWORK_ANOMALY = "NETWORK_ANOMALY"     # Port scan, beaconing pattern
    PERSISTENCE = "PERSISTENCE"             # Registry/cron/startup modification
    COMMAND_ANOMALY = "COMMAND_ANOMALY"      # Unusual command execution pattern
    APT_BEACONING = "APT_BEACONING"          # Periodic C2 callbacks with low jitter
    APT_STAGING = "APT_STAGING"              # Unusual file access patterns pre-exfiltration
    APT_C2_COMMUNICATION = "APT_C2_COMMUNICATION"  # DNS tunneling / encoded payloads
    AUTHENTICATION = "AUTHENTICATION"
    PROCESS_EXECUTION = "PROCESS_EXECUTION"
    NETWORK_BEACON = "NETWORK_BEACON"


@dataclass
class BehaviorBaseline(RakshastraModel):
    """Stores the 'normal' behavioral profile for an entity.

    The engine computes statistical baselines (mean, std, histograms) from
    historical data and stores them here. Each baseline is scoped to a
    single entity and a single feature dimension (e.g., 'login_hour',
    'bytes_out_per_hour', 'process_count').
    """
    entity_id: str = ""
    entity_type: EntityType = EntityType.USER
    feature_name: str = ""          # e.g. "login_hour", "bytes_out_per_hour"
    baseline_mean: float = 0.0
    baseline_std: float = 0.0
    baseline_min: float = 0.0
    baseline_max: float = 0.0
    sample_count: int = 0           # How many observations built this baseline
    histogram: dict = field(default_factory=dict)  # Bucketed frequency counts
    metadata: dict = field(default_factory=dict)    # Extra context (OS, subnet, etc.)

    @classmethod
    def from_dict(cls, data: dict):
        d = dict(data)
        if "entity_type" in d and isinstance(d["entity_type"], str):
            try:
                d["entity_type"] = EntityType(d["entity_type"])
            except ValueError:
                pass
        return cls(**d)


@dataclass
class AnomalyEvent(RakshastraModel):
    """A single detected behavioral anomaly.

    Produced when a new observation deviates significantly from the stored
    baseline. The `deviation_score` is the number of standard deviations
    from the baseline mean (z-score). Higher values = more anomalous.
    """
    entity_id: str = ""
    entity_type: EntityType = EntityType.USER
    category: AnomalyCategory = AnomalyCategory.PROCESS_ANOMALY
    feature_name: str = ""
    observed_value: float = 0.0
    baseline_mean: float = 0.0
    baseline_std: float = 0.0
    deviation_score: float = 0.0     # z-score: abs(observed - mean) / std
    severity: Severity = Severity.INFO
    confidence: Confidence = Confidence.TENTATIVE
    description: str = ""
    raw_evidence: str = ""           # Raw log line or data that triggered this
    mitre_tactic: str = ""           # e.g. "TA0001" (Initial Access)
    mitre_technique: str = ""        # e.g. "T1078" (Valid Accounts)
    recommended_action: str = ""
    metadata: dict = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict):
        d = dict(data)
        if "entity_type" in d and isinstance(d["entity_type"], str):
            d["entity_type"] = EntityType(d["entity_type"])
        if "category" in d and isinstance(d["category"], str):
            d["category"] = AnomalyCategory(d["category"])
        if "severity" in d and isinstance(d["severity"], str):
            d["severity"] = Severity(d["severity"])
        if "confidence" in d and isinstance(d["confidence"], str):
            d["confidence"] = Confidence(d["confidence"])
        return cls(**d)
