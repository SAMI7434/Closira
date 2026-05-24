"""
Abstract base repository — defines the interface all concrete repositories implement.
"""
from typing import Generic, TypeVar, Type, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import get_logger

T = TypeVar("T")


logger = get_logger("base_repository")


class BaseRepository(Generic[T]):
    """Generic CRUD repository for SQLAlchemy ORM models."""

    def __init__(self, db: Session, model: Type[T]):
        self._db = db
        self._model = model

    def get_by_id(self, entity_id: str) -> T | None:
        """Fetch a single entity by its primary key."""
        try:
            return self._db.query(self._model).filter(self._model.id == entity_id).first()
        except SQLAlchemyError as exc:
            logger.error("DB error in get_by_id: %s", exc)
            raise

    def get_all(self, skip: int = 0, limit: int = 100) -> list[T]:
        """Fetch all entities with pagination."""
        try:
            return self._db.query(self._model).offset(skip).limit(limit).all()
        except SQLAlchemyError as exc:
            logger.error("DB error in get_all: %s", exc)
            raise

    def create(self, **kwargs: Any) -> T:
        """Create and persist a new entity."""
        try:
            instance = self._model(**kwargs)
            self._db.add(instance)
            self._db.commit()
            self._db.refresh(instance)
            return instance
        except SQLAlchemyError as exc:
            self._db.rollback()
            logger.error("DB error in create: %s", exc)
            raise

    def delete(self, entity_id: str) -> bool:
        """Delete an entity by id. Returns True if deleted."""
        try:
            entity = self.get_by_id(entity_id)
            if not entity:
                return False
            self._db.delete(entity)
            self._db.commit()
            return True
        except SQLAlchemyError as exc:
            self._db.rollback()
            logger.error("DB error in delete: %s", exc)
            raise
