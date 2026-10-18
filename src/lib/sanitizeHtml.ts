/**
 * Sanitizes and cleans rich text / HTML content.
 * Normalizes non-breaking spaces (&nbsp; and \u00a0) and invisible break-inhibiting characters
 * so that long text wraps naturally at word boundaries without overflowing containers.
 */
export function cleanRichText(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\u2060/g, "")
    .replace(/\u200b/g, "");
}
