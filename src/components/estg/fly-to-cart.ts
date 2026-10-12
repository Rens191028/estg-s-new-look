/** Laat een klein bolletje van de knop naar het winkelmandje in de header vliegen. */
export function flyToCart(from: Element | null | undefined) {
  if (typeof document === "undefined" || !from || typeof Element.prototype.animate !== "function")
    return;
  const target = document.querySelector(".bag-pill");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!a.width || !b.width) return;
  const size = 22;
  const ghost = document.createElement("div");
  ghost.className = "fly-dot";
  ghost.setAttribute("aria-hidden", "true");
  ghost.style.left = `${a.left + a.width / 2 - size / 2}px`;
  ghost.style.top = `${a.top + a.height / 2 - size / 2}px`;
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.55}px,${dy * 0.55 - 60}px) scale(1.1)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate(${dx}px,${dy}px) scale(0.3)`, opacity: 0.4 },
    ],
    { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  );
  const done = () => ghost.remove();
  anim.onfinish = done;
  anim.oncancel = done;
}

/** Korte bounce op een element (bijv. het favorietenhartje) bij een klik. */
export function bump(el: Element | null | undefined) {
  if (!el) return;
  el.classList.remove("bump");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("bump");
  el.addEventListener("animationend", () => el.classList.remove("bump"), { once: true });
}
