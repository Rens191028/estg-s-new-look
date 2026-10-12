import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { brands, categories, products } from "@/lib/catalog";
import { CategoryIcon } from "./ui-bits";

const PAGES = [
  { label: "Webshop", to: "/webshop" },
  { label: "Aanbiedingen", to: "/aanbiedingen" },
  { label: "Producten vergelijken", to: "/vergelijken" },
  { label: "Winkelmand", to: "/winkelwagen" },
  { label: "AI-adviseur", to: "/advisor" },
  { label: "Systeem samenstellen", to: "/configurator" },
  { label: "Merken", to: "/merken" },
  { label: "Kennis & inspiratie", to: "/kennis" },
  { label: "Over ESTG", to: "/over-estg" },
  { label: "Contact", to: "/contact" },
  { label: "Mijn account", to: "/account" },
] as const;

export const OPEN_PALETTE_EVENT = "estg:open-palette";

/** Zoek- en navigatievenster: Cmd/Ctrl+K vanaf elke pagina, met dezelfde catalogusdata als de header-zoekbalk. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Zoek een product, categorie, merk of pagina…" />
      <CommandList>
        <CommandEmpty>Niets gevonden.</CommandEmpty>
        <CommandGroup heading="Pagina’s">
          {PAGES.map((p) => (
            <CommandItem
              key={p.to}
              value={`pagina ${p.label}`}
              onSelect={() =>
                go(() => {
                  if (p.to === "/webshop")
                    navigate({ to: "/webshop", search: { q: "", category: "", brand: "" } });
                  else if (p.to === "/advisor") navigate({ to: "/advisor", search: { vraag: "" } });
                  else if (p.to === "/account")
                    navigate({ to: "/account", search: { tab: "favorieten" } });
                  else navigate({ to: p.to });
                })
              }
            >
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Categorieën">
          {categories.map((c) => (
            <CommandItem
              key={c}
              value={`categorie ${c}`}
              onSelect={() =>
                go(() => navigate({ to: "/webshop", search: { q: "", category: c, brand: "" } }))
              }
            >
              <CategoryIcon category={c} size={16} />
              <span style={{ marginLeft: 8 }}>{c}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Merken">
          {brands.map((b) => (
            <CommandItem
              key={b}
              value={`merk ${b}`}
              onSelect={() =>
                go(() => navigate({ to: "/webshop", search: { q: "", category: "", brand: b } }))
              }
            >
              {b}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Producten">
          {products.map((p) => (
            <CommandItem
              key={p.id}
              value={`product ${p.name} ${p.brand} ${p.sku}`}
              onSelect={() => go(() => navigate({ to: "/producten/$id", params: { id: p.id } }))}
            >
              <span>
                {p.name} <small className="muted">· {p.brand}</small>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
