"""
Pydantic schemas for Enquiry CRUD and API payloads.
"""
from datetime import datetime
from typing import Any
from pydantic import BaseModel, EmailStr, Field
from app.db.models.enquiry import Channel, EnquiryStatus, Priority


class EnquiryCreate(BaseModel):
    """Schema for creating a new enquiry via POST /enquiry."""
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: str = Field(..., max_length=255)
    phone: str | None = Field(None, max_length=50)
    channel: Channel
    subject: str = Field(..., min_length=1, max_length=500)
    message: str = Field(..., min_length=1)
    conversation_history: list[dict[str, Any]] | None = None


class EnquiryResponse(BaseModel):
    """Schema returned after enquiry creation / retrieval."""
    id: str
    customer_name: str
    customer_email: str
    phone: str | None = None
    channel: Channel
    subject: str
    message: str
    status: EnquiryStatus
    priority: Priority | None = None
    sop_matched: str | None = None
    suggested_response: str | None = None
    conversation_history: list[dict[str, Any]] | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EnquiryStatusUpdate(BaseModel):
    """Schema for updating enquiry status."""
    status: EnquiryStatus


class EnquiryHistoryResponse(BaseModel):
    """Combined response: enquiry + timeline history."""
    enquiry: EnquiryResponse
    history: list[dict[str, Any]]


class HealthResponse(BaseModel):
    """Schema for the health check endpoint."""
    status: str = "healthy"
    version: str = "1.0.0"
