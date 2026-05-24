"""
Follow-up model — tracks follow-up actions taken on an enquiry.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class FollowUp(Base):
    """Follow-up record linked to an enquiry."""
    __tablename__ = "follow_ups"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id: Mapped[str] = mapped_column(String(36), ForeignKey("enquiries.id"))
    notes: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="follow_ups")

    def __repr__(self) -> str:
        return f"<FollowUp id={self.id} enquiry_id={self.enquiry_id}>"
