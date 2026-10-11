# AI-assistent

Widget (rechtsonder) en AI-Adviseur (`/advisor`) praten met één serverroute: `POST /api/assistant-chat`
(`src/lib/assistant/chat.server.ts`). Model: Claude via de Lovable AI Gateway (`LOVABLE_API_KEY`, server-only).

- Widget: streamt platte tekst; `X-Conversation-Id` header, opgeslagen in localStorage.
- Adviseur: gestructureerde output (samenvatting + product_id/aantal/reden), gecontroleerd tegen de catalogus.
- Kennis: tabel `assistant_knowledge` (facts, expertise), alleen via de server leesbaar.
- Gesprekken en berichten (incl. tokengebruik) in `assistant_conversations` / `assistant_messages`.
- Rate limit: 20 vragen per uur per browsersessie (anonieme sessiesleutel), geteld in de database.
- Productselectie: gefilterd uit de voorbeeldcatalogus (`src/lib/catalog.ts`, max 40). Product-id's zijn tekst-slugs.
