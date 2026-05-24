/**
 * Date / time formatting utilities.
 */
import { formatDistanceToNow, format } from "date-fns";

/** Format as relative time, e.g. "3 hours ago" — requires date-fns */
export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/** Format as DD/MM/YYYY */
export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "dd/MM/yyyy");
  } catch {
    return dateStr;
  }
}

/** Truncate a string to maxLen with ellipsis */
export function truncate(str: string, maxLen: number = 80): string {
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}
