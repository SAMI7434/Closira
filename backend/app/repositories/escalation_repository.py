"""
Concrete repository for the Escalation ORM model.
"""
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.models.escalation import Escalation, EscalationStatus
from app.repositories.base_repository import BaseRepository
from app.core.logging import get_logger

logger = get_logger("escalation_repository")


class EscalationRepository(BaseRepository[Escalation]):
    """Repository for Escalation entities."""

    def __init__(self, db: Session):
        super().__init__(db, Escalation)

    def get_pending(self, limit: int = 50) -> list[Escalation]:
        """Return pending escalations ordered by creation time."""
        try:
            return (
                self._db.query(Escalation)
                .filter(Escalation.status == EscalationStatus.PENDING)
                .order_by(Escalation.created_at.desc())
                .limit(limit)
                .all()
            )
        except Exception as exc:
            logger.error("get_pending failed: %s", exc)
            raise
