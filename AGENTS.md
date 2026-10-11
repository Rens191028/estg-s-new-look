<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep shared ESTG navigation and footer in the root layout and content in separate leaf routes for directly shareable pages.
- Keep illustrative catalog records in the browser-safe catalog module until a verified commerce source is connected; do not invent live pricing or stock.
- Keep the quotation basket in a React context for the current visit; it is not a persisted order or payment flow.
- Define presentation styles and semantic colors in the global design system to keep the storefront consistent.
- The AI assistant runs through the server route /api/assistant-chat with the server-side admin client, which checks conversation ownership via a per-browser session key; guests have no auth accounts, so RLS alone cannot scope them.
- Assistant knowledge lives in the assistant_knowledge table (server-only read) so ESTG facts can change without code edits.
