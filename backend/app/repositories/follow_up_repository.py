"""
Concrete repository for the FollowUp ORM model.
"""
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.models.follow_up import FollowUp
from app.repositories.base_repository import BaseRepository
from app.core.logging import get_logger

logger = get_logger("follow_up_repository")


class FollowUpRepository(BaseRepository[FollowUp]):
    """Repository for FollowUp entities."""

    def __init__(self, db: Session):
        super().__init__(db, FollowUp)

    def get_by_enquiry(self, enquiry_id: str) -> list[FollowUp]:
        """Return all follow-ups for a given enquiry, newest first."""
        try:
            return (
                self._db.query(FollowUp)
                .filter(FollowUp.enquiry_id == enquiry_id)
                .order_by(FollowUp.created_at.desc())
                .all()
            )
        except Exception as exc:
            logger.error("get_by_enquiry failed: %s", exc)
            raise
