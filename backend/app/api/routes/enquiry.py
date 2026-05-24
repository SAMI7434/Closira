"""
FastAPI route handlers for /enquiry endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.db.session import get_db
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryResponse,
    EnquiryHistoryResponse,
    HealthResponse,
)
from app.schemas.follow_up import FollowUpCreate, FollowUpResponse
from app.schemas.escalation import EscalationCreate, EscalationResponse
from app.services.enquiry_service import EnquiryService
from app.services.follow_up_service import FollowUpService
from app.services.escalation_service import EscalationService
from app.core.logging import get_logger

logger = get_logger("routes")

router = APIRouter(prefix="/enquiry", tags=["Enquiry"])


def get_service(db: Session = Depends(get_db)):
    """Dependency factory — injects a new service with fresh DB session."""
    return EnquiryService(db), FollowUpService(db), EscalationService(db)


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def create_enquiry(
    payload: EnquiryCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new customer enquiry.

    Triggers an async background task that:
    - Matches the message against SOP keywords
    - Generates a suggested response
    - Logs a timeline event
    """
    service = EnquiryService(db)
    result = service.create_enquiry(payload)
    logger.info("POST /enquiry — created %s", result.id)
    return result


@router.post("/{enquiry_id}/follow-up", response_model=FollowUpResponse)
def add_follow_up(
    enquiry_id: str,
    payload: FollowUpCreate,
    db: Session = Depends(get_db),
):
    """
    Add a follow-up note to an existing enquiry.

    Appends a 'follow_up_added' entry to the enquiry's timeline.
    """
    service = FollowUpService(db)
    result = service.add_follow_up(enquiry_id, payload)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    logger.info("POST /enquiry/%s/follow-up — ok", enquiry_id)
    return result


@router.post("/{enquiry_id}/escalate", response_model=EscalationResponse)
def escalate_enquiry(
    enquiry_id: str,
    payload: EscalationCreate,
    db: Session = Depends(get_db),
):
    """
    Escalate an enquiry to a human agent.

    Sets the enquiry status to ESCALATED and records the escalation in the timeline.
    """
    service = EscalationService(db)
    result = service.escalate(enquiry_id, payload)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    logger.info("POST /enquiry/%s/escalate — ok", enquiry_id)
    return result


@router.get("/{enquiry_id}/history", response_model=EnquiryHistoryResponse)
def get_enquiry_history(enquiry_id: str, db: Session = Depends(get_db)):
    """
    Retrieve an enquiry together with its full state-change history (timeline).
    """
    service = EnquiryService(db)
    result = service.get_history(enquiry_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    logger.info("GET /enquiry/%s/history — ok", enquiry_id)
    return result


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Simple liveness probe."""
    logger.debug("GET /health — ok")
    return HealthResponse()
