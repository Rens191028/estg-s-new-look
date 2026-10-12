import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Horizontale leesbalk direct onder de sticky header die van links naar rechts meevult. */
export function ReadingProgress({ targetSelector }: { targetSelector: string }) {
  const [progress, setProgress] = useState(0);
  const [headerBottom, setHeaderBottom] = useState<number | null>(null);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const update = () => {
      // De merkenbalk staat eerst boven de header: meet de zichtbare onderrand,
      // niet alleen de hoogte. Dit volgt ook het krimpen en de mobiele header.
      setHeaderBottom(Math.max(0, header?.getBoundingClientRect().bottom ?? 0));
      const el = document.querySelector(targetSelector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Onderkant van het leesvenster (80% van de hoogte) ten opzichte van de lengte van het artikel.
      const read = (window.innerHeight * 0.8 - rect.top) / Math.max(rect.height, 1);
      setProgress(Math.min(1, Math.max(0, read)));
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (header) observer?.observe(header);
    const article = document.querySelector(targetSelector);
    if (article) observer?.observe(article);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [targetSelector]);
  const pct = Math.round(progress * 100);
  if (headerBottom === null) return null;
  // Buiten de geanimeerde pagina plaatsen: transforms/opacity kunnen anders
  // een eigen stacking context of containing block voor position:fixed maken.
  return createPortal(
    <div
      className="reading-progress"
      style={{ top: headerBottom }}
      role="progressbar"
      aria-label="Leesvoortgang"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>,
    document.body,
  );
}
