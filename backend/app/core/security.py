"""
Security utilities: API key header extraction and per-request context attrs.
"""
import logging
from fastapi import Request
from app.core.logging import get_logger

logger = get_logger("security")


def get_client_ip(request: Request) -> str:
    """Extract the real client IP from the request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def log_request(request: Request, call_next):
    """Middleware that logs every incoming HTTP request."""
    logger.info(
        "HTTP request received",
        extra_data={
            "method": request.method,
            "path": request.url.path,
            "client_ip": get_client_ip(request),
        },
    )
    response = await call_next(request)
    logger.info(
        "HTTP response sent",
        extra_data={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
        },
    )
    return response
