"""
Escalation model — tracks issues escalated to human agents.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.db.base import Base


class EscalationStatus(str, enum.Enum):
    """Status of an escalation."""
    PENDING = "pending"
    ASSIGNED = "assigned"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Escalation(Base):
    """Escalation record linked to an enquiry."""
    __tablename__ = "escalations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id: Mapped[str] = mapped_column(String(36), ForeignKey("enquiries.id"))
    reason: Mapped[str] = mapped_column(Text)
    assignee: Mapped[str | None] = mapped_column(String(255), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    status: Mapped[EscalationStatus] = mapped_column(Enum(EscalationStatus), default=EscalationStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="escalations")

    def __repr__(self) -> str:
        return f"<Escalation id={self.id} status={self.status}>"
