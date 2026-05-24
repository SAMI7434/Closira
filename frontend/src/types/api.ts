/**
 * Shared TypeScript types — mirror the FastAPI Pydantic schemas.
 */
export type Channel = "email" | "whatsapp" | "chat" | "phone";

export type EnquiryStatus = "new" | "processing" | "resolved" | "escalated";
export type EscalationStatus = "pending" | "assigned" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface ConversationMessage {
  role: "customer" | "agent";
  content: string;
}

export interface Enquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string | null;
  channel: Channel;
  subject: string;
  message: string;
  status: EnquiryStatus;
  priority: Priority | null;
  sop_matched: string | null;
  suggested_response: string | null;
  conversation_history: ConversationMessage[] | null;
  created_at: string;   // ISO 8601
  updated_at: string;   // ISO 8601
}

export interface EnquiryHistory {
  enquiry: Enquiry;
  history: TimelineEntry[];
}

export interface TimelineEntry {
  id: string;
  enquiry_id: string;
  event: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

export interface FollowUp {
  id: string;
  enquiry_id: string;
  notes: string;
  created_at: string;
}

export interface Escalation {
  id: string;
  enquiry_id: string;
  reason: string;
  assignee: string | null;
  priority: string;
  status: EscalationStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface HealthResponse {
  status: string;
  version: string;
}