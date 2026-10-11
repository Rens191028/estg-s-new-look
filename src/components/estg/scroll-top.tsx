import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Verschijnt na het naar beneden scrollen; scrolt soepel terug naar boven. */
export function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      className={`scroll-top ${visible ? "visible" : ""}`}
      aria-label="Terug naar boven"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={20} />
    </button>
  );
}
