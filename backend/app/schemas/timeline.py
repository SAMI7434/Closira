"""
Pydantic schemas for Timeline entries.
"""
from datetime import datetime
from pydantic import BaseModel
from app.db.models.timeline import Timeline


class TimelineResponse(BaseModel):
    """Schema returned in the enquiry history."""
    id: str
    enquiry_id: str
    event: str
    old_value: str | None
    new_value: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
