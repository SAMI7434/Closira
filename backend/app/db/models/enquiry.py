"""
SQLAlchemy ORM model: Enquiry — the central entity representing a customer enquiry.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, Integer, ForeignKey
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.db.base import Base


class Channel(str, enum.Enum):
    """Communication channel for an enquiry."""
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    CHAT = "chat"
    PHONE = "phone"


class EnquiryStatus(str, enum.Enum):
    """Lifecycle status of an enquiry."""
    NEW = "new"
    PROCESSING = "processing"
    RESOLVED = "resolved"
    ESCALATED = "escalated"


class Priority(str, enum.Enum):
    """Escalation priority level."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Enquiry(Base):
    """Enquiry ORM model."""
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name: Mapped[str] = mapped_column(String(255))
    customer_email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    channel: Mapped[Channel] = mapped_column(Enum(Channel))
    subject: Mapped[str] = mapped_column(String(500))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[EnquiryStatus] = mapped_column(Enum(EnquiryStatus), default=EnquiryStatus.NEW)
    priority: Mapped[Priority | None] = mapped_column(Enum(Priority), nullable=True)
    sop_matched: Mapped[str | None] = mapped_column(String(255), nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    conversation_history: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    follow_ups: Mapped[list["FollowUp"]] = relationship(back_populates="enquiry", cascade="all, delete-orphan")
    escalations: Mapped[list["Escalation"]] = relationship(back_populates="enquiry", cascade="all, delete-orphan")
    timelines: Mapped[list["Timeline"]] = relationship(back_populates="enquiry", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Enquiry id={self.id} subject='{self.subject[:40]}' status={self.status}>"
