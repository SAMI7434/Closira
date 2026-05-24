"""
FastAPI application entry point.

Sets up:
- CORS middleware
- Structured logging
- Custom request-logging middleware
- All route handlers
- SQLAlchemy table creation on startup
"""
from contextlib import asynccontextmanager

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.db.session import engine
from app.db.base import Base
from app.db.models import enquiry, sop, follow_up, escalation, timeline
from app.api.routes import enquiry as enquiry_routes

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: create tables on startup, log shutdown."""
    setup_logging()
    Base.metadata.create_all(bind=engine)
    logger.info(
        "Application started — %s v%s",
        settings.app_name,
        settings.app_version,
    )
    yield
    logger.info("Application shutting down")


def create_app() -> FastAPI:
    """Factory function — returns a configured FastAPI instance."""
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Closira Enquiry Management API — accepts customer enquiries, "
            "runs SOP keyword matching in background, tracks follow-ups and escalations."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request logging middleware
    from app.core.security import log_request
    application.middleware("http")(log_request)

    # Routers
    application.include_router(enquiry_routes.router, prefix="/api/v1")

    return application


app = create_app()
