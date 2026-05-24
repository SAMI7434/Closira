"""
Service layer for Enquiry business logic.
Orchestrates repositories, SOP matching, and timeline events.
"""
from sqlalchemy.orm import Session
from app.db.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryHistoryResponse
from app.repositories.enquiry_repository import EnquiryRepository
from app.repositories.timeline_repository import TimelineRepository
from app.workers.sop_matcher import process_enquiry_async
from app.core.logging import get_logger

logger = get_logger("enquiry_service")


class EnquiryService:
    """Business logic for enquiry management."""

    def __init__(self, db: Session):
        self._db = db
        self._repo = EnquiryRepository(db)
        self._timeline_repo = TimelineRepository(db)

    def create_enquiry(self, payload: EnquiryCreate) -> EnquiryResponse:
        """
        Create a new enquiry and kick off async SOP processing.

        Steps:
        1. Persist enquiry with status=NEW.
        2. Add a 'created' timeline event.
        3. Fire-and-forget async SOP matching task.
        """
        enquiry_data = payload.model_dump()
        phone_val = enquiry_data.pop("phone", None)
        conv_hist = enquiry_data.pop("conversation_history", None)
        enquiry = self._repo.create(**enquiry_data, phone=phone_val, conversation_history=conv_hist)

        self._timeline_repo.create(
            enquiry_id=enquiry.id,
            event="created",
            new_value=enquiry.status.value,
        )
        self._db.commit()

        logger.info("Enquiry created: %s", enquiry.id)

        # Fire-and-forget background task
        import asyncio
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            loop.create_task(process_enquiry_async(enquiry.id))
        else:
            asyncio.run(process_enquiry_async(enquiry.id))

        return EnquiryResponse.model_validate(enquiry)

    def get_enquiry(self, enquiry_id: str) -> EnquiryResponse | None:
        """Fetch a single enquiry by ID."""
        enquiry = self._repo.get_by_id(enquiry_id)
        if not enquiry:
            return None
        return EnquiryResponse.model_validate(enquiry)

    def get_all_enquiries(self, skip: int = 0, limit: int = 100) -> list[EnquiryResponse]:
        """Return all enquiries, newest first."""
        enquiries = (
            self._db.query(Enquiry)
            .order_by(Enquiry.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return [EnquiryResponse.model_validate(e) for e in enquiries]

    def get_history(self, enquiry_id: str) -> EnquiryHistoryResponse | None:
        """
        Retrieve the enquiry with its full timeline history.
        """
        enquiry = self._repo.get_by_id(enquiry_id)
        if not enquiry:
            return None

        timeline = self._timeline_repo.get_by_enquiry(enquiry_id)
        history = [
            {
                "event": t.event,
                "old_value": t.old_value,
                "new_value": t.new_value,
                "created_at": t.created_at.isoformat(),
            }
            for t in timeline
        ]

        return EnquiryHistoryResponse(
            enquiry=EnquiryResponse.model_validate(enquiry),
            history=history,
        )
