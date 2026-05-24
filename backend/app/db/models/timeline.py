"""
Timeline model — tracks state change events for an enquiry.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Timeline(Base):
    """Audit trail entry for an enquiry."""
    __tablename__ = "timelines"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id: Mapped[str] = mapped_column(String(36), ForeignKey("enquiries.id"))
    event: Mapped[str] = mapped_column(String(255))
    old_value: Mapped[str | None] = mapped_column(String(255), nullable=True)
    new_value: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="timelines")

    def __repr__(self) -> str:
        return f"<Timeline id={self.id} enquiry_id={self.enquiry_id} event='{self.event}'>"
