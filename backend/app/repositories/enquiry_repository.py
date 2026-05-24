"""
Concrete repository for the Enquiry ORM model.
Extends BaseRepository with enquiry-specific queries.
"""
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.models.enquiry import Enquiry, EnquiryStatus
from app.repositories.base_repository import BaseRepository
from app.core.logging import get_logger

logger = get_logger("enquiry_repository")


class EnquiryRepository(BaseRepository[Enquiry]):
    """Repository with enquiry-specific query helpers."""

    def __init__(self, db: Session):
        super().__init__(db, Enquiry)

    def get_by_status(self, status: EnquiryStatus, skip: int = 0, limit: int = 100) -> list[Enquiry]:
        """Filter enquiries by status."""
        try:
            return (
                self._db.query(Enquiry)
                .filter(Enquiry.status == status)
                .order_by(Enquiry.created_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )
        except Exception as exc:
            logger.error("get_by_status failed: %s", exc)
            raise

    def get_by_channel(self, channel: str, skip: int = 0, limit: int = 100) -> list[Enquiry]:
        """Filter enquiries by communication channel."""
        try:
            return (
                self._db.query(Enquiry)
                .filter(Enquiry.channel == channel)
                .order_by(Enquiry.created_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )
        except Exception as exc:
            logger.error("get_by_channel failed: %s", exc)
            raise

    def update_status(self, enquiry_id: str, status: EnquiryStatus) -> Enquiry | None:
        """Atomically update the status of an enquiry."""
        try:
            enquiry = self.get_by_id(enquiry_id)
            if not enquiry:
                return None
            enquiry.status = status
            self._db.commit()
            self._db.refresh(enquiry)
            return enquiry
        except Exception as exc:
            self._db.rollback()
            logger.error("update_status failed: %s", exc)
            raise
