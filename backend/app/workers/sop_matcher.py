"""
Background SOP matcher worker.
Simulates async processing: loads SOP rules, scores against message,
sets suggested response, and escalates if no match.
"""
import asyncio
import json
import os
import uuid
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("sop_matcher")


DEFAULT_SOP_RULES = [
    {
        "name": "Refund Policy",
        "keywords": ["refund", "money back", "return", "reimburse"],
        "response_template": (
            "We're sorry to hear about your refund concern. "
            "According to our Refund Policy, eligible items can be returned within 30 days of purchase. "
            "Please share your order ID so we can initiate the refund process."
        ),
        "priority": 2,
    },
    {
        "name": "Technical Support",
        "keywords": ["not working", "broken", "bug", "crash", "error", "fix"],
        "response_template": (
            "I'm sorry you're experiencing technical issues. "
            "Can you please provide:\n1. Device model\n2. OS version\n3. Steps to reproduce\nOur engineers will be on it right away."
        ),
        "priority": 3,
    },
    {
        "name": "Account Access",
        "keywords": ["login", "password", "account", "forgot", "reset", "access"],
        "response_template": (
            "Having trouble accessing your account? "
            "Click the 'Forgot Password' link on the login page, or use our secure "
            "password reset tool here: https://app.closira.com/reset-password"
        ),
        "priority": 2,
    },
    {
        "name": "Billing Inquiry",
        "keywords": ["invoice", "bill", "charge", "payment", "pricing", "subscription"],
        "response_template": (
            "Thank you for your billing inquiry. "
            "Our billing cycle resets on the 1st of every month. "
            "Please provide your invoice number so I can pull up the details."
        ),
        "priority": 1,
    },
    {
        "name": "Delivery Status",
        "keywords": ["delivery", "shipping", "late", "tracking", "courier", "package"],
        "response_template": (
            "We apologize for any delay. "
            "Please share your tracking number, and our logistics team will check "
            "the current location and estimated delivery time."
        ),
        "priority": 2,
    },
]


def _load_sop_rules() -> list[dict]:
    """Load SOP rules from a JSON file; fall back to defaults if file missing."""
    path = settings.sop_keywords_file
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Failed to load SOP file: %s — using defaults", exc)
    return DEFAULT_SOP_RULES


def match_sop(message: str, sop_rules: list[dict]) -> tuple[str | None, str | None]:
    """
    Match the customer message against SOP keyword rules.

    Returns:
        (matched_sop_name, suggested_response) tuple.
        (None, None) if no rule matched.
    """
    message_lower = message.lower()
    best_match = None
    best_priority = float("inf")

    for rule in sop_rules:
        if not rule.get("is_active", True):
            continue
        score = sum(1 for kw in rule["keywords"] if kw.lower() in message_lower)
        if score > 0 and rule.get("priority", 99) < best_priority:
            best_priority = rule["priority"]
            best_match = rule

    if best_match:
        logger.info(
            "SOP matched: %s (priority=%d)",
            best_match["name"],
            best_match["priority"],
        )
        return best_match["name"], best_match["response_template"]

    logger.info("No SOP rule matched — escalation required")
    return None, None


async def process_enquiry_async(enquiry_id: str) -> None:
    """
    Background task: process a newly created enquiry.

    1. Fetch the enquiry from the DB
    2. Run SOP keyword matching
    3. Update suggested_response and sop_matched fields
    4. Create a timeline event
    5. If no SOP matched, set status to 'processing' (signal for escalation)
    """
    from app.db.session import SessionLocal
    from app.db.models.enquiry import Enquiry, EnquiryStatus
    from app.db.models.timeline import Timeline
    from app.repositories.timeline_repository import TimelineRepository

    logger.info("Starting async processing for enquiry %s", enquiry_id)

    db: Session = SessionLocal()
    try:
        sop_rules = _load_sop_rules()
        matched_name, suggested_reply = match_sop(
            message=db.query(Enquiry.message)
            .filter(Enquiry.id == enquiry_id)
            .scalar(),
            sop_rules=sop_rules,
        )

        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if not enquiry:
            logger.error("Enquiry %s not found", enquiry_id)
            return

        enquiry.sop_matched = matched_name
        enquiry.suggested_response = suggested_reply
        yet_status = EnquiryStatus.PROCESSING if matched_name else EnquiryStatus.PROCESSING
        enquiry.status = yet_status

        timeline_repo = TimelineRepository(db)
        timeline_repo.create(
            enquiry_id=enquiry.id,
            event="sop_processing_complete",
            old_value="new",
            new_value=enquiry.status.value,
        )

        db.commit()
        logger.info(
            "Async processing complete for %s — sop_matched=%s status=%s",
            enquiry_id,
            matched_name,
            enquiry.status.value,
        )

    except Exception as exc:
        logger.exception("Async processing failed for %s: %s", enquiry_id, exc)
        db.rollback()
    finally:
        db.close()
