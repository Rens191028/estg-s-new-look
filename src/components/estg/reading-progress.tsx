import { useEffect, useState } from "react";

/** Horizontale leesbalk direct onder de sticky header die van links naar rechts meevult. */
export function ReadingProgress({ targetSelector }: { targetSelector: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.querySelector(targetSelector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Onderkant van het leesvenster (80% van de hoogte) ten opzichte van de lengte van het artikel.
      const read = (window.innerHeight * 0.8 - rect.top) / Math.max(rect.height, 1);
      setProgress(Math.min(1, Math.max(0, read)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);
  const pct = Math.round(progress * 100);
  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Leesvoortgang"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
