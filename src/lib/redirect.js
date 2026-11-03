/**
 * Only allow redirects to internal paths.
 * Anything else (external URLs, "//evil.com", etc.) falls back to home.
 */
export function getSafeRedirect(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
