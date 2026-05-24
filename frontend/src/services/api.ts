/**
 * Thin API client.
 * Swap mock implementations with real fetch calls when the backend is ready.
 */
import type { Enquiry, FollowUp, Escalation } from "../types/api";

const BASE_URL = "http://localhost:8000/api/v1";

// ── helpers ──────────────────────────────────────────────────────────────────
async function _handle(res: Response): Promise<any> {
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).detail || res.statusText;
    throw new Error(msg);
  }
  return res.json();
}

// ── Enquiry ──────────────────────────────────────────────────────────────────
export async function postEnquiry(body: Partial<Enquiry>): Promise<Enquiry> {
  const res = await fetch(`${BASE_URL}/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return _handle(res);
}

export async function getEnquiryHistory(id: string): Promise<Enquiry> {
  const res = await fetch(`${BASE_URL}/enquiry/${id}/history`);
  return _handle(res);
}

// ── Escalation ───────────────────────────────────────────────────────────────
export async function postEscalate(
  id: string,
  body: { reason: string; priority: string; assignee?: string | null },
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/enquiry/${id}/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return _handle(res);
}

// ── Follow-up ────────────────────────────────────────────────────────────────
export async function postFollowUp(
  id: string,
  body: { notes: string },
): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/enquiry/${id}/follow-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return _handle(res);
}

// ── Health ───────────────────────────────────────────────────────────────────
export async function getHealth(): Promise<{ status: string; version: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  return _handle(res);
}