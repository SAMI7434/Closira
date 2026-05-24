/**
 * Realistic mock data that mirrors the backend API response shapes.
 * Used by the frontend screens until a real API service is connected.
 */
import type { Enquiry, FollowUp, Escalation } from "../types/api";

export const MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: "e1a2b3c4",
    customer_name: "Alice Johnson",
    customer_email: "alice@example.com",
    phone: "+1-555-0100",
    channel: "email",
    subject: "Refund request for order #1234",
    message: "I would like to request a refund for my recent order #1234.",
    status: "processing",
    priority: "medium",
    sop_matched: "Refund Policy",
    suggested_response:
      "We're sorry to hear about your refund concern. According to our Refund Policy, eligible items can be returned within 30 days of purchase.",
    conversation_history: [
      { role: "customer", content: "I want a refund" },
      { role: "agent",    content: "Sure, can you share your order number?" },
      { role: "customer", content: "It is #1234" },
    ],
    created_at: "2024-12-01T10:30:00Z",
    updated_at: "2024-12-01T11:00:00Z",
  },
  {
    id: "f2d3e4a5",
    customer_name: "Bob Williams",
    customer_email: "bob@example.com",
    phone: "+1-555-0200",
    channel: "whatsapp",
    subject: "App keeps crashing on launch",
    message: "Technical support needed — the app is not working / it is broken and crashes every time I open it on my Android phone.",
    status: "escalated",
    priority: "high",
    sop_matched: null,
    suggested_response: null,
    conversation_history: [
      { role: "customer", content: "My app is not working" },
      { role: "agent",    content: "Could you tell me more about the issue?" },
    ],
    created_at: "2024-12-02T14:00:00Z",
    updated_at: "2024-12-02T16:30:00Z",
  },
  {
    id: "a1b2c3d4",
    customer_name: "Charlie Brown",
    customer_email: "charlie@example.com",
    phone: null,
    channel: "chat",
    subject: "Billing discrepancy on invoice #5678",
    message: "I was overcharged on my invoice. I need to understand what the extra charge is about regarding my subscription.",
    status: "new",
    priority: "low",
    sop_matched: null,
    suggested_response: null,
    conversation_history: null,
    created_at: "2024-12-03T08:15:00Z",
    updated_at: "2024-12-03T08:15:00Z",
  },
  {
    id: "b2c3d4e5",
    customer_name: "Diana Prince",
    customer_email: "diana@example.com",
    phone: "+1-555-0300",
    channel: "email",
    subject: "Forgot my password / cannot login",
    message: "I forgot my password and I cannot access my account. Please help me reset it.",
    status: "resolved",
    priority: "medium",
    sop_matched: "Account Access",
    suggested_response:
      "Having trouble accessing your account? Click the 'Forgot Password' link on the login page, or use our secure password reset tool.",
    conversation_history: null,
    created_at: "2024-11-28T09:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "c3d4e5f6",
    customer_name: "Eva Martinez",
    customer_email: "eva@example.com",
    phone: "+1-555-0400",
    channel: "phone",
    subject: "Tracking number not showing on portal",
    message: "My delivery is late and the tracking number is not showing on the portal. I need an update on my shipping status.",
    status: "processing",
    priority: "medium",
    sop_matched: "Delivery Status",
    suggested_response:
      "We apologize for any delay. Please share your tracking number, and our logistics team will check the current location.",
    conversation_history: null,
    created_at: "2024-12-03T12:00:00Z",
    updated_at: "2024-12-03T12:30:00Z",
  },
];

export const MOCK_FOLLOW_UPS: FollowUp[] = [
  { id: "f1", enquiry_id: "e1a2b3c4", notes: "Called customer — they confirmed the refund was received.",              created_at: "2024-12-01T12:00:00Z" },
  { id: "f2", enquiry_id: "e1a2b3c4", notes: "Refund processed successfully via original payment method.",       created_at: "2024-12-01T11:30:00Z" },
  { id: "f3", enquiry_id: "b2c3d4e5", notes: "Sent password reset instructions. Customer confirmed access.",        created_at: "2024-11-30T14:00:00Z" },
  { id: "f4", enquiry_id: "c3d4e5f6", notes: "Logistics team confirmed the package is out for delivery.",       created_at: "2024-12-03T13:00:00Z" },
];

export const MOCK_ESCALATIONS: Escalation[] = [
  {
    id: "x1",
    enquiry_id: "f2d3e4a5",
    reason: "Technical issue not covered by any SOP. App crash requires engineer review.",
    assignee: "agent-007",
    priority: "high",
    status: "pending",
    created_at: "2024-12-02T16:00:00Z",
    resolved_at: null,
  },
  {
    id: "x2",
    enquiry_id: "e1a2b3c4",
    reason: "Customer threatening legal action — needs manager review.",
    assignee: "manager-01",
    priority: "urgent",
    status: "assigned",
    created_at: "2024-12-01T09:00:00Z",
    resolved_at: null,
  },
];

export const MOCK_TIMELINE = (enquiryId: string): import("../types/api").TimelineEntry[] => {
  const base = { id: "", enquiry_id: enquiryId, old_value: null as string | null, new_value: null as string | null };
  return [
    { ...base, id: `${enquiryId}-t1`, created_at: `${enquiryId.slice(0,10)}T08:00:00Z`, event: "created",                    new_value: "new" },
    { ...base, id: `${enquiryId}-t2`, created_at: `${enquiryId.slice(0,10)}T08:30:00Z`, event: "sop_processing_complete", old_value: "new",               new_value: "processing" },
    { ...base, id: `${enquiryId}-t3`, created_at: `${enquiryId.slice(0,10)}T09:00:00Z`, event: "status_changed",           old_value: "processing",       new_value: "escalated" },
    { ...base, id: `${enquiryId}-t4`, created_at: `${enquiryId.slice(0,10)}T10:00:00Z`, event: "follow_up_added",         old_value: null,              new_value: "Called customer" },
  ];
};