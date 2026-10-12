import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/** Dunne voortgangsbalk bovenaan die kort oplicht bij elke routewissel. */
export function RouteProgress() {
  const href = useRouterState({ select: (s) => s.location.href });
  const first = useRef(true);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setRun((n) => n + 1);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [href]);

  return visible ? (
    <div key={run} className="route-progress" role="presentation" aria-hidden />
  ) : null;
}
