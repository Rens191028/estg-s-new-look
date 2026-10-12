import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "estg_cookie_consent";

/** Kleine consent-banner: verschijnt bij het eerste bezoek en onthoudt de keuze in localStorage. */
export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* opslag niet beschikbaar: toon de banner niet telkens opnieuw */
    }
  }, []);

  const choose = (value: "all" | "necessary") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* negeren */
    }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <section className="cookie-banner" role="dialog" aria-label="Cookies en privacy">
      <Cookie size={22} aria-hidden />
      <p>
        Deze voorbeeldwebsite gebruikt alleen functionele opslag in je browser (winkelmand,
        vergelijken, favorieten en chat). We plaatsen geen advertentie- of trackingcookies.
      </p>
      <div className="cookie-actions">
        <Button variant="outline" size="sm" onClick={() => choose("necessary")}>
          Alleen noodzakelijk
        </Button>
        <Button size="sm" onClick={() => choose("all")}>
          Accepteren
        </Button>
      </div>
    </section>
  );
}
