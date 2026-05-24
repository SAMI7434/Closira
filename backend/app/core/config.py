"""
Global application configuration using Pydantic Settings.
Reads values from environment variables with sensible defaults.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = "Closira Enquiry API"
    app_version: str = "1.0.0"
    debug: bool = True

    db_url: str = "sqlite:///./data/closira.db"
    db_echo: bool = False

    log_level: str = "INFO"
    log_format: str = "json"

    sop_keywords_file: str = "data/sop_rules.json"
    suggested_responses_file: str = "data/suggested_responses.json"

    max_conversation_history: int = 50
    escalation_priority_min: int = 3

    cors_origins: list[str] = ["*"]


settings = Settings()
