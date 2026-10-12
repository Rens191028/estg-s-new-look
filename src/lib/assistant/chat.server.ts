import { createAnthropic } from "@ai-sdk/anthropic";
import { Output, streamText, type ModelMessage } from "ai";
import { z } from "zod";
import { categories, findProduct } from "../catalog";
import { evaluateSet, panelsPerSet, roofKind, roofKindFromText } from "./compat";
import { catalogLines, compatFacts, relevantProducts } from "./context";
import { clampMessage, MAX_HISTORY, MAX_MESSAGE_LENGTH, RATE_LIMIT } from "./guards";

const MODEL = "anthropic/claude-sonnet-5";
const FALLBACK = "Bel ons gerust op 085 016 7800 (ma-vr 8:30-17:30).";

const input = z.object({
  conversation_id: z.string().uuid().optional(),
  session_key: z.string().min(16).max(100),
  message: z
    .string()
    .min(1)
    .max(MAX_MESSAGE_LENGTH * 2),
  source: z.enum(["widget", "advisor"]),
  page_context: z.string().max(300).optional(),
});

const adviceSchema = z.object({
  summary: z
    .string()
    .describe(
      "Korte conclusie in het Nederlands, maximaal 2 zinnen. Geen productdetails of onderbouwing hier: die staan per aanbeveling in 'reason'.",
    ),
  recommendations: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().int(),
      reason: z
        .string()
        .describe(
          "Maximaal 1-2 zinnen: waarom dit product, kort en concreet, geen herhaling van de conclusie.",
        ),
    }),
  ),
});

const fail = (status: number, code: string, message: string) =>
  Response.json({ ok: false, code, message: `${message} ${FALLBACK}` }, { status });

function systemPrompt(source: "widget" | "advisor", knowledge: string[], message: string) {
  const list = relevantProducts(message, 40);
  const facts = compatFacts(list);
  return [
    "Je bent de ESTG-assistent: een proactieve, technische B2B-adviseur voor installateurs. Antwoord in het Nederlands, zakelijk en concreet; vraag door als technische gegevens ontbreken.",
    ...knowledge,
    "Regels: je mag prijzen noemen, maar uitsluitend de prijs die letterlijk bij het product in de catalogus hieronder staat (€ excl. btw, voorbeeldprijs) — staat er een 'was'-prijs bij (aanbieding), dan mag je die aanbieding en de was-/voorprijs noemen; verzin NOOIT een korting, aanbieding, staffelprijs of ander bedrag dat niet in de catalogus staat, en noem geen garantie-uitkomsten. Verzin NOOIT voorraad, levertijden of specificaties. Noem alleen producten uit de catalogus hieronder en verwijs naar ESTG (085 016 7800) als iets onbekend is. Deze website is een voorbeeldomgeving met een illustratief assortiment.",
    source === "widget"
      ? "Dit is de chatwidget: kort en puntig, maximaal 2-3 korte zinnen, geen opsomming van alle redenen achter elkaar in doorlopende tekst. Platte tekst zonder markdown (geen sterretjes of tabellen)."
      : "Dit is de AI-Adviseur: geef een conclusie van maximaal 2 zinnen en een lijst aanbevolen producten (product_id exact uit de catalogus, aantal en een korte reden van 1-2 zinnen per product). Zet vervolgvragen niet in de conclusie.",
    `Categorieën: ${categories.join(", ")}.`,
    "Relevante catalogus (id | naam | merk | categorie | prijs | specs):\n" + catalogLines(list),
    "Door code vastgestelde compatibiliteitscontroles:\n" +
      (facts.length ? facts.join("\n") : "- Geen controles voor deze selectie."),
  ].join("\n\n");
}

export async function handleAssistantChat(request: Request): Promise<Response> {
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(400, "invalid", "Je bericht kon niet worden verwerkt.");
  const data = parsed.data;
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return fail(500, "not_configured", "De assistent is nog niet geconfigureerd.");

  const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");

  // Gesprek ophalen (alleen als het bij deze sessie hoort) of nieuw aanmaken.
  let conversationId = data.conversation_id;
  if (conversationId) {
    const { data: conv } = await db
      .from("assistant_conversations")
      .select("id, session_key")
      .eq("id", conversationId)
      .maybeSingle();
    if (!conv || conv.session_key !== data.session_key) conversationId = undefined;
  }

  // Rate limit: user-berichten van deze sessie in het afgelopen uur.
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { data: convs } = await db
    .from("assistant_conversations")
    .select("id")
    .eq("session_key", data.session_key);
  const ids = (convs ?? []).map((c) => c.id);
  if (ids.length) {
    const { count } = await db
      .from("assistant_messages")
      .select("id", { count: "exact", head: true })
      .in("conversation_id", ids)
      .eq("role", "user")
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT)
      return fail(
        429,
        "rate_limited",
        "Je hebt het maximum van 20 vragen per uur bereikt. Probeer het later opnieuw.",
      );
  }

  if (!conversationId) {
    const { data: conv, error } = await db
      .from("assistant_conversations")
      .insert({
        source: data.source,
        page_context: data.page_context ?? null,
        session_key: data.session_key,
      })
      .select("id")
      .single();
    if (error || !conv) {
      console.error("[assistant] conversation insert", error);
      return fail(500, "storage", "Het gesprek kon niet worden gestart.");
    }
    conversationId = conv.id;
  }

  const [{ data: knowledge }, { data: history }] = await Promise.all([
    db
      .from("assistant_knowledge")
      .select("section, content")
      .eq("active", true)
      .order("section", { ascending: false }),
    db
      .from("assistant_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(MAX_HISTORY),
  ]);

  const message = clampMessage(data.message);
  const { error: userErr } = await db
    .from("assistant_messages")
    .insert({ conversation_id: conversationId, role: "user", content: message });
  if (userErr) console.error("[assistant] user message insert", userErr);

  const messages: ModelMessage[] = [
    ...(history ?? [])
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: message },
  ];
  const anthropic = createAnthropic({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const system = systemPrompt(
    data.source,
    (knowledge ?? []).map((k) => `${k.section.toUpperCase()}:\n${k.content}`),
    message,
  );
  const cid: string = conversationId!;
  const save = async (content: string, tokens: number | undefined, productIds?: string[]) => {
    const { error } = await db.from("assistant_messages").insert({
      conversation_id: cid,
      role: "assistant",
      content,
      token_usage: tokens ?? null,
      recommended_product_ids: productIds ?? null,
    });
    if (error) console.error("[assistant] assistant message insert", error);
  };

  if (data.source === "advisor") {
    try {
      const result = streamText({
        model: anthropic(MODEL),
        system,
        messages,
        maxOutputTokens: 2048,
        maxRetries: 0,
        output: Output.object({ schema: adviceSchema }),
      });
      const out = await result.output;
      const usage = await result.totalUsage;
      const recommendations = out.recommendations.flatMap((r) =>
        findProduct(r.product_id)
          ? [
              {
                productId: r.product_id,
                quantity: Math.min(999, Math.max(1, Math.round(r.quantity || 1))),
                reason: r.reason,
              },
            ]
          : [],
      );
      // Montage: bij panelen altijd een passend systeem (op daktype) met het berekende aantal sets.
      const roof = roofKindFromText(data.message);
      const panelCount = recommendations
        .filter((r) => findProduct(r.productId)?.category === "Zonnepanelen")
        .reduce((a, r) => a + r.quantity, 0);
      if (panelCount > 0) {
        const fits = (id: string) => {
          const p = findProduct(id);
          const kind = roofKind(p?.specs.find((s) => s.label === "Daktype")?.value);
          return !!p && p.category === "Montagemateriaal" && !!panelsPerSet(p) && (!roof || kind === roof);
        };
        let idx = recommendations.findIndex((r) => fits(r.productId));
        for (let i = recommendations.length - 1; i >= 0; i--)
          if (findProduct(recommendations[i]!.productId)?.category === "Montagemateriaal" && i !== idx) {
            recommendations.splice(i, 1);
            if (i < idx) idx--;
          }
        if (idx < 0 && roof) {
          const pick = products.find((p) => fits(p.id));
          if (pick) {
            recommendations.push({ productId: pick.id, quantity: 1, reason: "" });
            idx = recommendations.length - 1;
          }
        }
        const rec = idx >= 0 ? recommendations[idx] : undefined;
        const mnt = rec && findProduct(rec.productId);
        const per = mnt && panelsPerSet(mnt);
        if (rec && per) {
          rec.quantity = Math.ceil(panelCount / per);
          rec.reason = `Passend bij een ${roofKind(mnt.specs.find((s) => s.label === "Daktype")?.value)} dak: ${panelCount} panelen / ${per} per set = ${rec.quantity} ${rec.quantity === 1 ? "set" : "sets"}.`;
        }
      }
      const warnings = evaluateSet(
        recommendations.map((r) => ({ id: r.productId, quantity: r.quantity })),
        roof,
      )
        .filter((r) => r.status === "niet-compatibel")
        .map((r) => r.reason);
      await save(
        out.summary,
        usage.totalTokens,
        recommendations.map((r) => r.productId),
      );
      return Response.json({
        ok: true,
        conversation_id: cid,
        reply: out.summary,
        recommendations,
        warnings,
      });
    } catch (error) {
      console.error("[assistant] advisor error", error);
      return fail(502, "upstream", "De AI-adviseur is tijdelijk niet beschikbaar.");
    }
  }

  const result = streamText({
    model: anthropic(MODEL),
    system,
    messages,
    maxOutputTokens: 1024,
    maxRetries: 0,
    onFinish: async ({ text, totalUsage }) => {
      if (text.trim()) await save(text, totalUsage.totalTokens);
    },
    onError: ({ error }) => console.error("[assistant] widget stream error", error),
  });
  return result.toTextStreamResponse({
    headers: { "X-Conversation-Id": cid, "Cache-Control": "no-cache, no-transform" },
  });
}
