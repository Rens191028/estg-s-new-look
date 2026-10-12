import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { brands, categories, products } from "@/lib/catalog";
import { OPEN_PALETTE_EVENT } from "./command-palette";
import { CategoryIcon } from "./ui-bits";

type Suggestion =
  | {
      kind: "product";
      key: string;
      id: string;
      title: string;
      sub: string;
      image?: string | undefined;
    }
  | { kind: "category"; key: string; title: string }
  | { kind: "brand"; key: string; title: string };

export function suggest(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const productHits = products
    .filter((p) => `${p.name} ${p.brand} ${p.category} ${p.sku}`.toLowerCase().includes(q))
    .slice(0, 5)
    .map<Suggestion>((p) => ({
      kind: "product",
      key: `p-${p.id}`,
      id: p.id,
      title: p.name,
      sub: `${p.brand} · ${p.category}`,
      image: p.image,
    }));
  const categoryHits = categories
    .filter((c) => c.toLowerCase().includes(q))
    .map<Suggestion>((c) => ({ kind: "category", key: `c-${c}`, title: c }));
  const brandHits = brands
    .filter((b) => b.toLowerCase().includes(q))
    .slice(0, 4)
    .map<Suggestion>((b) => ({ kind: "brand", key: `b-${b}`, title: b }));
  return [...productHits, ...categoryHits, ...brandHits];
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

const groupLabels = { product: "Producten", category: "Categorieën", brand: "Merken" } as const;

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const results = useMemo(() => suggest(query), [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (s: Suggestion) => {
    setOpen(false);
    setQuery("");
    if (s.kind === "product") navigate({ to: "/producten/$id", params: { id: s.id } });
    else if (s.kind === "category")
      navigate({ to: "/webshop", search: { q: "", category: s.title, brand: "" } });
    else navigate({ to: "/webshop", search: { q: "", category: "", brand: s.title } });
  };
  const showAll = () => {
    setOpen(false);
    navigate({ to: "/webshop", search: { q: query.trim(), category: "", brand: "" } });
  };

  const panelOpen = open && query.trim().length > 0;
  return (
    <div className="search" ref={rootRef}>
      <form
        className="search-box"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const picked = active >= 0 ? results[active] : undefined;
          if (picked) go(picked);
          else showAll();
        }}
      >
        <SearchIcon size={18} aria-hidden />
        <input
          aria-label="Zoeken naar producten"
          aria-expanded={panelOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          role="combobox"
          placeholder="Zoek producten, merken of artikelnummers…"
          value={query}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            }
          }}
        />
        <button
          type="button"
          className="palette-hint"
          aria-label="Open zoek- en navigatievenster (Ctrl K)"
          onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
        >
          Ctrl K
        </button>
      </form>
      {panelOpen && (
        <div className="search-panel" id={listId} role="listbox">
          {results.length === 0 ? (
            <p className="muted" style={{ padding: "12px 10px", margin: 0 }}>
              Geen suggesties voor “{query}”.
            </p>
          ) : (
            (["product", "category", "brand"] as const).map((kind) => {
              const group = results.filter((r) => r.kind === kind);
              if (!group.length) return null;
              return (
                <div className="search-group" key={kind}>
                  <h4>{groupLabels[kind]}</h4>
                  {group.map((s) => (
                    <Fragment key={s.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={results[active]?.key === s.key}
                        data-active={results[active]?.key === s.key}
                        className="search-item"
                        onClick={() => go(s)}
                      >
                        {s.kind === "product" ? (
                          s.image ? (
                            <img src={s.image} alt="" width={36} height={36} />
                          ) : (
                            <span className="search-thumb">
                              <SearchIcon size={16} />
                            </span>
                          )
                        ) : s.kind === "category" ? (
                          <span className="search-thumb">
                            <CategoryIcon
                              category={s.title as (typeof categories)[number]}
                              size={18}
                            />
                          </span>
                        ) : null}
                        <span>
                          <Highlight text={s.title} query={query} />
                          {s.kind === "product" && <small>{s.sub}</small>}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              );
            })
          )}
          <button type="button" className="search-all search-item" onClick={showAll}>
            Alle resultaten voor “{query.trim()}” bekijken <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
