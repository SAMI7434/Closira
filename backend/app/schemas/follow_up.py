"""
Pydantic schemas for FollowUp CRUD.
"""
from datetime import datetime
from pydantic import BaseModel, Field
from app.db.models.follow_up import FollowUp


class FollowUpCreate(BaseModel):
    """Schema for creating a follow-up on an enquiry."""
    notes: str = Field(..., min_length=1)


class FollowUpResponse(BaseModel):
    """Schema returned after follow-up creation."""
    id: str
    enquiry_id: str
    notes: str
    created_at: datetime

    model_config = {"from_attributes": True}
