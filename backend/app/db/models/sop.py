"""
SOP rules model — keyword-based matching rules for auto-response.
"""
import uuid
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class SOP(Base):
    """Standard Operating Procedure rule stored in the database."""
    __tablename__ = "sops"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), unique=True)
    keywords: Mapped[str] = mapped_column(Text)
    response_template: Mapped[str] = mapped_column(Text)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<SOP id={self.id} name='{self.name}' priority={self.priority}>"
