"""
Concrete repository for the Timeline ORM model.
"""
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.models.timeline import Timeline
from app.repositories.base_repository import BaseRepository
from app.core.logging import get_logger

logger = get_logger("timeline_repository")


class TimelineRepository(BaseRepository[Timeline]):
    """Repository for Timeline entries."""

    def __init__(self, db: Session):
        super().__init__(db, Timeline)

    def get_by_enquiry(self, enquiry_id: str) -> list[Timeline]:
        """Return the full timeline for an enquiry, oldest first."""
        try:
            return (
                self._db.query(Timeline)
                .filter(Timeline.enquiry_id == enquiry_id)
                .order_by(Timeline.created_at.asc())
                .all()
            )
        except Exception as exc:
            logger.error("get_by_enquiry failed: %s", exc)
            raise

    def create(self, enquiry_id: str, event: str, old_value: str | None = None, new_value: str | None = None) -> Timeline:
        """Create a new timeline event."""
        try:
            entry = Timeline(
                id=__import__("uuid").uuid4().__str__(),
                enquiry_id=enquiry_id,
                event=event,
                old_value=old_value,
                new_value=new_value,
            )
            self._db.add(entry)
            self._db.commit()
            self._db.refresh(entry)
            return entry
        except Exception as exc:
            self._db.rollback()
            logger.error("create timeline event failed: %s", exc)
            raise
