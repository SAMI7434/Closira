"""
Reusable response / data formatting utilities.
"""
from datetime import datetime
from typing import Any


def serialize_datetime(value: datetime | None) -> str | None:
    """Format a datetime object as an ISO 8601 string."""
    if value is None:
        return None
    return value.isoformat()


def dict_filter_none(d: dict) -> dict:
    """Return a copy of d with all None-valued keys removed."""
    return {k: v for k, v in d.items() if v is not None}
