import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag, Minus, Plus, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/estg/page-intro";
import { useStore } from "@/components/estg/store";
import { products, pageHead } from "@/lib/catalog";
export const Route = createFileRoute("/winkelwagen")({
  head: () =>
    pageHead(
      "Jouw productaanvraag",
      "Bekijk je geselecteerde duurzame energieproducten en bereid je aanvraag voor ESTG voor.",
    ),
  component: Cart,
});
function Cart() {
  const { items, update } = useStore();
  const download = () => {
    const text =
      "ESTG — Productaanvraag\n\n" +
      items
        .map(
          (i) =>
            `${i.quantity} × ${products.find((p) => p.id === i.id)?.name} (${products.find((p) => p.id === i.id)?.brand})`,
        )
        .join("\n") +
      "\n\nVoorbeeldassortiment. Prijzen, specificaties en beschikbaarheid te bevestigen door ESTG. Geen bestelling geplaatst.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ESTG-productaanvraag.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageIntro
        title="Jouw productaanvraag"
        description="Alle geselecteerde oplossingen voor jouw project op een rij."
      />
      <section className="container section">
        {items.length ? (
          <>
            {items.map((i) => {
              const p = products.find((p) => p.id === i.id);
              if (!p) return null;
              return (
                <div className="cart-row" key={i.id}>
                  <img src={p.image} alt={p.name} width={816} height={816} />
                  <div>
                    <Link to="/producten/$id" params={{ id: p.id }}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p>{p.brand} · Prijs op aanvraag</p>
                  </div>
                  <div className="quantity">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${p.name} verminderen`}
                      onClick={() => update(i.id, i.quantity - 1)}
                    >
                      <Minus />
                    </Button>
                    <input
                      aria-label={`Aantal ${p.name}`}
                      type="number"
                      min={1}
                      max={999}
                      value={i.quantity}
                      onChange={(e) =>
                        update(i.id, Math.max(1, Math.min(999, Number(e.target.value) || 1)))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${p.name} verhogen`}
                      onClick={() => update(i.id, Math.min(999, i.quantity + 1))}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`${p.name} verwijderen`}
                    onClick={() => update(i.id, 0)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}
            <div className="cart-summary">
              <p>{items.reduce((a, x) => a + x.quantity, 0)} producten in jouw aanvraag</p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" onClick={download}>
                  <Download />
                  Download aanvraag
                </Button>
                <Button asChild>
                  <Link to="/contact">
                    Neem contact op <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
            <p className="sample-note">
              Er is geen bestelling geplaatst. Download je selectie en bespreek deze met ESTG. Je
              selectie blijft alleen tijdens dit bezoek bewaard.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={40} />
            <h2>Een nieuw project begint hier.</h2>
            <p>Je aanvraaglijst is nog leeg.</p>
            <Button asChild>
              <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
                Ontdek het assortiment <ArrowUpRight />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
