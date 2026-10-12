export const RECENT_KEY = "estg_recent_products";
export const MAX_RECENT = 8;

/** Zet een product vooraan, zonder dubbelen, begrensd op MAX_RECENT. */
export function pushRecent(ids: string[], id: string) {
  return [id, ...ids.filter((x) => x !== id)].slice(0, MAX_RECENT);
}

export function readRecent(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

export function writeRecent(ids: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* opslag niet beschikbaar */
  }
}
