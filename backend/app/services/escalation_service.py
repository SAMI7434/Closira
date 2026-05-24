"""
Service layer for Escalation business logic.
"""
from sqlalchemy.orm import Session
from app.db.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.escalation import EscalationCreate, EscalationResponse
from app.repositories.escalation_repository import EscalationRepository
from app.repositories.enquiry_repository import EnquiryRepository
from app.repositories.timeline_repository import TimelineRepository
from app.core.logging import get_logger

logger = get_logger("escalation_service")


class EscalationService:
    """Business logic for escalation management."""

    def __init__(self, db: Session):
        self._db = db
        self._repo = EscalationRepository(db)
        self._enquiry_repo = EnquiryRepository(db)
        self._timeline_repo = TimelineRepository(db)

    def escalate(self, enquiry_id: str, payload: EscalationCreate) -> EscalationResponse | None:
        """
        Escalate an enquiry to a human agent.

        1. Creates an escalation record.
        2. Updates the enquiry status to ESCALATED.
        3. Records a timeline event.
        """
        enquiry = self._enquiry_repo.get_by_id(enquiry_id)
        if not enquiry:
            logger.warning("Enquiry %s not found — cannot escalate", enquiry_id)
            return None

        escalation = self._repo.create(
            enquiry_id=enquiry_id,
            reason=payload.reason,
            assignee=payload.assignee,
            priority=payload.priority,
        )

        enquiry.status = EnquiryStatus.ESCALATED
        self._timeline_repo.create(
            enquiry_id=enquiry_id,
            event="escalated",
            old_value=enquiry.status.value,
            new_value=EnquiryStatus.ESCALATED.value,
        )
        self._db.commit()

        logger.info("Enquiry %s escalated — reason: %s", enquiry_id, payload.reason)
        return EscalationResponse.model_validate(escalation)

    def get_pending_escalations(self) -> list[EscalationResponse]:
        """Return all pending escalations."""
        escalations = self._repo.get_pending()
        return [EscalationResponse.model_validate(e) for e in escalations]
