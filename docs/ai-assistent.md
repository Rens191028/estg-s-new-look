# AI-assistent (eerste versie)

Gebouwd uit het plan "ESTG AI-Assistent, implementatieplan voor Lovable + Claude Code", aangepast aan deze
repo (TanStack Start, geen Supabase). De LLM-aanroep loopt via een server function
(`src/lib/assistant/chat.functions.ts`); de sleutel staat nooit in de browserbundel.

## Configuratie (server-omgevingsvariabelen)

- `ANTHROPIC_API_KEY` (verplicht; zonder sleutel meldt de assistent dat hij niet is geconfigureerd)
- `ASSISTANT_MODEL` (optioneel, standaard `claude-sonnet-5-5`)
- `ANTHROPIC_BASE_URL` (optioneel, voor tests met een mock)

## Wat er is

- Widget (rechtsonder) en adviseurpagina (`/advisor`) delen één server function.
- Catalogus per vraag gefilterd (`context.ts`), geen vaste cap.
- Compatibiliteitsregels als code (`compat.ts`); het model krijgt de uitkomst als feit mee. Adviseur-antwoorden
  gaan via tool-use (`geef_advies`); onbekende product-id's worden weggefilterd en de set wordt door code gecontroleerd.
- Inputlimiet (1000 tekens), historie beperkt tot 6 berichten, rate limit 20/uur per IP (in-memory),
  tokengebruik per aanroep in de serverlog.

## Bewust nog niet (vereist een database of aanvullende data)

- Opslag van gesprekken, kennisbank-tabel, feedback-duimen, RLS, persistente rate limiting.
- Streaming-antwoorden (nu één antwoord per vraag).
- Echte compatibiliteitsdata: de regels leunen op illustratieve demo-specs; protocol/spanningsklasse ontbreekt,
  dus omvormer-batterij geeft "onbekend" bij een hybride omvormer.
- Geen prijzen/voorraad/levertijden: de assistent mag die niet noemen (zie `knowledge.ts`).
- Het systeem is niet getest tegen de echte Anthropic API; wel tegen een lokale mock.
