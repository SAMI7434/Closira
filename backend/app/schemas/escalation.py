"""
Pydantic schemas for Escalation CRUD.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.db.models.escalation import EscalationStatus


class EscalationCreate(BaseModel):
    """Schema for escalating an enquiry."""
    reason: str = Field(..., min_length=1)
    assignee: str | None = None
    priority: str = Field("medium")


class EscalationResponse(BaseModel):
    """Schema returned after escalation."""
    id: str
    enquiry_id: str
    reason: str
    assignee: str | None = None
    priority: str
    status: EscalationStatus
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
