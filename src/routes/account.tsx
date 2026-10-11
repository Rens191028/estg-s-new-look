import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageIntro } from "@/components/estg/page-intro";
import { ProductCard } from "@/components/estg/product-card";
import { useAuth } from "@/components/estg/auth";
import { useFavorites } from "@/components/estg/favorites";
import { findProduct, pageHead } from "@/lib/catalog";

const TABS = ["favorieten", "gegevens", "bestellingen"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/account")({
  validateSearch: (s: Record<string, unknown>): { tab: Tab } => ({
    tab: TABS.includes(s["tab"] as Tab) ? (s["tab"] as Tab) : "favorieten",
  }),
  head: () => pageHead("Account", "Je favorieten, gegevens en bestellingen bij ESTG."),
  component: Account,
});

function Account() {
  const { user, loading } = useAuth();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/inloggen", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <section className="container empty-state" aria-busy="true">
        <p>Even laden…</p>
      </section>
    );
  }

  return (
    <>
      <PageIntro title="Mijn account" description="Je favorieten, gegevens en bestellingen." />
      <section className="container section account-tabs">
        <Tabs
          value={tab}
          onValueChange={(v) => navigate({ to: "/account", search: { tab: v as Tab } })}
        >
          <TabsList>
            <TabsTrigger value="favorieten">Favorieten</TabsTrigger>
            <TabsTrigger value="gegevens">Gegevens</TabsTrigger>
            <TabsTrigger value="bestellingen">Bestellingen</TabsTrigger>
          </TabsList>
          <TabsContent value="favorieten" style={{ marginTop: 24 }}>
            <FavoritesTab />
          </TabsContent>
          <TabsContent value="gegevens" style={{ marginTop: 24 }}>
            <DetailsTab />
          </TabsContent>
          <TabsContent value="bestellingen" style={{ marginTop: 24 }}>
            <div className="empty-state">
              <ShoppingBag size={40} />
              <h2>Je hebt nog geen bestellingen</h2>
              <p>
                Bestellen via deze voorbeeldwebsite is nog niet mogelijk. Gebruik je winkelmand om
                je selectie met ESTG te bespreken.
              </p>
              <Button asChild>
                <Link to="/winkelwagen">Naar winkelmand</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}

function FavoritesTab() {
  const { ids } = useFavorites();
  const products = ids.flatMap((id) => findProduct(id) ?? []);
  if (!products.length)
    return (
      <div className="empty-state">
        <Heart size={40} />
        <h2>Je hebt nog geen favorieten</h2>
        <p>Tik op het hartje bij een product om het hier te bewaren.</p>
        <Button asChild>
          <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
            Naar de webshop
          </Link>
        </Button>
      </div>
    );
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function DetailsTab() {
  const { user, profile, saveProfile } = useAuth();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  if (!profile) return <p className="muted">Even laden…</p>;
  return (
    <form
      className="account-form"
      key={user?.id}
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState("saving");
        const { error } = await saveProfile({
          full_name: String(f.get("name") ?? "").trim() || null,
          company_name: String(f.get("company") ?? "").trim() || null,
          vat_number: String(f.get("vat") ?? "").trim() || null,
        });
        setState(error ? "error" : "saved");
      }}
    >
      <div className="field">
        <label htmlFor="name">Naam</label>
        <input id="name" name="name" defaultValue={profile.full_name ?? ""} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="company">Bedrijfsnaam</label>
        <input
          id="company"
          name="company"
          defaultValue={profile.company_name ?? ""}
          autoComplete="organization"
        />
      </div>
      <div className="field">
        <label htmlFor="email">E-mailadres</label>
        <input id="email" value={user?.email ?? ""} readOnly aria-readonly />
      </div>
      <div className="field">
        <label htmlFor="vat">BTW-nummer</label>
        <input
          id="vat"
          name="vat"
          defaultValue={profile.vat_number ?? ""}
          placeholder="NL123456789B01"
        />
      </div>
      {state === "error" && (
        <div className="form-error" role="alert">
          Opslaan is niet gelukt. Probeer het opnieuw.
        </div>
      )}
      {state === "saved" && (
        <div className="form-note" role="status">
          Je gegevens zijn opgeslagen.
        </div>
      )}
      <Button type="submit" disabled={state === "saving"}>
        {state === "saving" ? "Opslaan…" : "Opslaan"}
      </Button>
    </form>
  );
}
