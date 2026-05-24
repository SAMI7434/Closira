/** Utility helper for conditional classnames. */
export function cn(...classes: (string | null | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
