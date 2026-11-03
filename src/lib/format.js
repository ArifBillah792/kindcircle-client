// "2026-12-20T00:00:00.000Z" → "20 December 2026"
// timeZone UTC so the date never shifts by a day
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
