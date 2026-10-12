import { useEffect, useState } from "react";
import { pushRecent, readRecent, writeRecent } from "@/lib/recent";

/** Houdt recent bekeken producten bij (localStorage) en geeft de lijst zonder het huidige product terug. */
export function useRecentlyViewed(currentId: string | undefined) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const stored = readRecent();
    setIds(stored.filter((id) => id !== currentId));
    if (currentId) writeRecent(pushRecent(stored, currentId));
  }, [currentId]);
  return ids;
}
