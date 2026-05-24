"""
Basic integration tests for the FastAPI application.
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.db.base import Base
from app.db.session import SessionLocal, engine as _engine
from app.db.models import enquiry, sop, follow_up, escalation, timeline
from app.main import app

# ── In-memory SQLite test DB ─────────────────────────────────────────────────
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    """Create tables before each test and drop them after."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client():
    return TestClient(app)


class TestHealth:
    def test_health_endpoint(self, client):
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"


class TestEnquiryCreation:
    def test_create_enquiry_success(self, client):
        payload = {
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "phone": None,
            "channel": "email",
            "subject": "Password reset issue",
            "message": "I cannot reset my password.",
            "conversation_history": [],
        }
        resp = client.post("/api/v1/enquiry", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["customer_name"] == "Test User"
        assert data["customer_email"] == "test@example.com"
        assert data["status"] == "new"
        assert data["suggested_response"] is None  # async task hasn't run yet
        assert "id" in data

    def test_create_enquiry_validates_email(self, client):
        payload = {
            "customer_name": "Bad Email",
            "customer_email": "not-an-email",
            "channel": "email",
            "subject": "Test",
            "message": "Test message",
        }
        resp = client.post("/api/v1/enquiry", json=payload)
        assert resp.status_code == 422

    def test_create_enquiry_missing_field(self, client):
        payload = {
            "customer_name": "Missing Field",
            "channel": "email",
            "subject": "Test",
            "message": "Test message",
        }
        resp = client.post("/api/v1/enquiry", json=payload)
        assert resp.status_code == 422


class TestFollowUp:
    def test_add_follow_up(self, client):
        # First create an enquiry
        create_resp = client.post(
            "/api/v1/enquiry",
            json={
                "customer_name": "Foo",
                "customer_email": "foo@bar.com",
                "channel": "chat",
                "subject": "Test",
                "message": "Test message",
            },
        )
        enquiry_id = create_resp.json()["id"]

        fu_resp = client.post(
            f"/api/v1/enquiry/{enquiry_id}/follow-up",
            json={"notes": "Followed up with customer."},
        )
        assert fu_resp.status_code == 200
        assert fu_resp.json()["notes"] == "Followed up with customer."

    def test_follow_up_not_found(self, client):
        resp = client.post(
            "/api/v1/enquiry/nonexistent-id/follow-up",
            json={"notes": "Test"},
        )
        assert resp.status_code == 404


class TestEscalation:
    def test_escalate_enquiry(self, client):
        create_resp = client.post(
            "/api/v1/enquiry",
            json={
                "customer_name": "Esc Me",
                "customer_email": "esc@example.com",
                "channel": "phone",
                "subject": "Complex issue",
                "message": "No standard solution covers this.",
            },
        )
        enquiry_id = create_resp.json()["id"]

        esc_resp = client.post(
            f"/api/v1/enquiry/{enquiry_id}/escalate",
            json={
                "reason": "No matching SOP found.",
                "assignee": "agent-007",
                "priority": "high",
            },
        )
        assert esc_resp.status_code == 200
        data = esc_resp.json()
        assert data["reason"] == "No matching SOP found."
        assert data["status"] == "pending"

    def test_escalate_not_found(self, client):
        resp = client.post(
            "/api/v1/enquiry/nonexistent-id/escalate",
            json={"reason": "test"},
        )
        assert resp.status_code == 404


class TestHistory:
    def test_get_history(self, client):
        create_resp = client.post(
            "/api/v1/enquiry",
            json={
                "customer_name": "Hist Me",
                "customer_email": "hist@example.com",
                "channel": "email",
                "subject": "Test history",
                "message": "Test history message.",
            },
        )
        enquiry_id = create_resp.json()["id"]

        resp = client.get(f"/api/v1/enquiry/{enquiry_id}/history")
        assert resp.status_code == 200
        data = resp.json()
        assert "enquiry" in data
        assert "history" in data
        assert data["enquiry"]["id"] == enquiry_id

    def test_history_not_found(self, client):
        resp = client.get("/api/v1/enquiry/nonexistent-id/history")
        assert resp.status_code == 404
