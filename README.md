# Closira

Closira is an AI-powered customer communication platform for SMBs. It handles inbound enquiries across WhatsApp, email, and phone, using business-defined SOPs to qualify leads, schedule follow-ups, and escalate to human agents.\





![image alt](https://github.com/SAMI7434/Closira/blob/fd20ed6906900cb46634c57831c9fdcaaf059e0f/mermaid-diagram-2026-05-25-121923.png)


## Repository Structure

- backend/ FastAPI service for enquiry ingestion, SOP matching, and timeline tracking
- frontend/ React Native (Expo) mobile app for dashboards, leads, escalations, and follow-ups

## Quick Start

Each part of the stack has its own README with full setup and run steps:

- backend/README.md for API setup, Docker, and environment variables
- frontend/README.md for Expo setup, scripts, and API configuration

## Local Development (High-Level)

1) Backend: start the FastAPI server (defaults to http://localhost:8000)
2) Frontend: start the Expo dev server and run on device/emulator

## Notes

- Backend uses SQLite by default and supports async SOP keyword matching.
- Frontend uses mock data by default; update the API base URL when connecting to the backend.
