# Prijsstaffel verwijderd (productpagina opgeschoond)

**Status:** doorgevoerd op branch `claude/prijsstaffel-verwijderen`
**Aanleiding:** de productpagina moet overzichtelijker en compacter. De prijsstaffel (ronde 11, deel A) voegde een extra tabel, een live totaalregel en een disclaimer toe vlak bij de koopknoppen en maakte de pagina zwaarder. Besluit: de staffel vervalt; prijzen blijven simpel (één voorbeeldprijs per product).

## Wat is verwijderd

| Onderdeel | Plek | Wijziging |
| --- | --- | --- |
| `PriceTier`-type en `Product.priceTiers` | `src/lib/catalog.ts` | verwijderd |
| Staffel-generatie in `enrich()` (`tierCategories`, percentages) | `src/lib/catalog.ts` | verwijderd; `enrich()` vult alleen nog certificeringen aan |
| `unitPrice(product, quantity)` | `src/lib/catalog.ts` | verwijderd; overal `product.price × aantal` |
| `PriceTiers`-component (tabel + live totaal) | `src/components/estg/ui-bits.tsx` | verwijderd |
| Staffelweergave bij de prijs | `src/routes/producten.$id.tsx` | verwijderd |
| Staffelprijs in subtotaal | `src/components/estg/store.tsx` | subtotaal = som van `price × quantity` |
| "staffelprijs"-label per regel, tekstdownload, printoverzicht | `src/routes/winkelwagen.tsx` | terug naar normale stuksprijs; geen doorgestreepte basisprijs meer |
| Stuksprijs/regeltotaal in besteloverzicht | `src/routes/bestellen.tsx` | terug naar normale stuksprijs |
| `.tier-*`-stijlen | `src/styles.css` | verwijderd |
| Staffeltests | `src/lib/lib.test.ts` | verwijderd (test voor certificeringen blijft) |

## Wat blijft staan (ongewijzigd uit ronde 11)

- **Projectnaam / klantreferentie** in winkelmand, besteloverzicht, bevestiging en selectie (deel B).
- **Selectie/printoverzicht in ESTG-huisstijl** met logo, bedrijfsgegevens, tabel en footer (deel C), nu met gewone stuksprijzen.
- **Certificeringen** als chips onder de specificaties, met de disclaimer dat het illustratieve voorbeelddata is (deel D). De stijlklasse voor die disclaimer is hernoemd van `.tier-note` naar `.cert-note`.

## Gevolgen voor andere onderdelen

- De prijsregels voor de AI-assistent (`src/lib/assistant/knowledge.ts`, `chat.server.ts`) verbieden al dat de assistent korting of staffelprijzen verzint; er zijn dus geen aanpassingen nodig.
- De catalogus-disclaimer onder Specificaties (ronde 12) is ongewijzigd.
- Er is geen datamigratie nodig: de winkelmand is alleen sessiestate.

## Als een staffel later toch terugkomt

Pas doen zodra ESTG echte staffelprijzen aanlevert (`AGENTS.md`: geen verzonnen prijzen). Bouw het dan opnieuw als verifieerbare data in de catalogus, niet als gegenereerde percentages. De oorspronkelijke implementatie staat in commit `cfa3307` ("Ronde 11") en kan daar worden teruggehaald.

## Controle

`tsc`, 40 unit tests en de productiebuild slagen.
