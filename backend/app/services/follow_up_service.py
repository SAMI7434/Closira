"""
Service layer for FollowUp business logic.
"""
from sqlalchemy.orm import Session
from app.db.models.enquiry import Enquiry
from app.schemas.follow_up import FollowUpCreate, FollowUpResponse
from app.repositories.follow_up_repository import FollowUpRepository
from app.repositories.enquiry_repository import EnquiryRepository
from app.repositories.timeline_repository import TimelineRepository
from app.core.logging import get_logger

logger = get_logger("follow_up_service")


class FollowUpService:
    """Business logic for follow-up management."""

    def __init__(self, db: Session):
        self._db = db
        self._repo = FollowUpRepository(db)
        self._enquiry_repo = EnquiryRepository(db)
        self._timeline_repo = TimelineRepository(db)

    def add_follow_up(self, enquiry_id: str, payload: FollowUpCreate) -> FollowUpResponse | None:
        """Add a follow-up note to an enquiry and record a timeline event."""
        enquiry = self._enquiry_repo.get_by_id(enquiry_id)
        if not enquiry:
            logger.warning("Enquiry %s not found — cannot add follow-up", enquiry_id)
            return None

        follow_up = self._repo.create(enquiry_id=enquiry_id, notes=payload.notes)
        self._timeline_repo.create(
            enquiry_id=enquiry_id,
            event="follow_up_added",
            new_value=payload.notes[:80],
        )
        self._db.commit()
        logger.info("Follow-up added to enquiry %s", enquiry_id)
        return FollowUpResponse.model_validate(follow_up)

    def get_follow_ups(self, enquiry_id: str) -> list[FollowUpResponse]:
        """Return all follow-ups for an enquiry."""
        follow_ups = self._repo.get_by_enquiry(enquiry_id)
        return [FollowUpResponse.model_validate(f) for f in follow_ups]
