/**
 * Application-wide constants.
 */
export const API_BASE_URL = "http://localhost:8000/api/v1";

export const CHANNEL_LABELS: Record<string, string> = {
  email:    "Email",
  whatsapp: "WhatsApp",
  chat:     "Live Chat",
  phone:    "Phone",
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  new:        { label: "New",       bg: "bg-blue-100",       text: "text-blue-700" },
  processing: { label: "Processing", bg: "bg-amber-100",      text: "text-amber-700" },
  resolved:   { label: "Resolved",  bg: "bg-emerald-100",    text: "text-emerald-700" },
  escalated:  { label: "Escalated", bg: "bg-red-100",        text: "text-red-700" },
};

export const ESCALATION_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:  { label: "Pending",  bg: "bg-amber-100", text: "text-amber-700" },
  assigned: { label: "Assigned", bg: "bg-blue-100",  text: "text-blue-700" },
  resolved: { label: "Resolved", bg: "bg-emerald-100", text: "text-emerald-700" },
  closed:   { label: "Closed",   bg: "bg-gray-100",  text: "text-gray-700" },
};

export const COLORS = {
  white:       "#ffffff",
  primary:     "#3b82f6",
  primaryDark: "#1d4ed8",
  danger:      "#ef4444",
  success:     "#10b981",
  warning:     "#f59e0b",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray300:     "#d1d5db",
  gray500:     "#6b7280",
  gray700:     "#374151",
  gray900:     "#111827",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};