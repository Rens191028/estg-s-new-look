import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { findProduct } from "../catalog";
import { evaluateSet } from "./compat";
import { buildSystemPrompt, relevantProducts } from "./context";
import { clampMessage, createRateLimiter, MAX_HISTORY, MAX_MESSAGE_LENGTH } from "./guards";
import type { AssistantResult, Recommendation } from "./types";

const limiter = createRateLimiter();

const input = z.object({
  source: z.enum(["widget", "advisor"]),
  message: z
    .string()
    .min(1)
    .max(MAX_MESSAGE_LENGTH * 2),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(MAX_HISTORY * 2)
    .default([]),
});

const adviceTool = {
  name: "geef_advies",
  description:
    "Geef een korte samenvatting en de aanbevolen producten uit de meegegeven catalogus.",
  input_schema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "Korte samenvatting in het Nederlands." },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            product_id: { type: "string" },
            quantity: { type: "integer", minimum: 1 },
            reason: { type: "string" },
          },
          required: ["product_id", "quantity", "reason"],
        },
      },
    },
    required: ["summary", "recommendations"],
  },
} as const;

type Block =
  | { type: "text"; text: string }
  | { type: "tool_use"; name: string; input: { summary?: string; recommendations?: unknown[] } };

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator(input)
  .handler(async ({ data }): Promise<AssistantResult> => {
    const key = process.env["ANTHROPIC_API_KEY"];
    if (!key)
      return {
        ok: false,
        code: "not_configured",
        message: "De assistent is nog niet geconfigureerd.",
      };

    const who = getRequestIP({ xForwardedFor: true }) ?? "anoniem";
    const gate = limiter.check(who);
    if (!gate.ok)
      return {
        ok: false,
        code: "rate_limited",
        message: `Je hebt het maximale aantal vragen bereikt. Probeer het over ${Math.ceil(gate.retryAfterSec / 60)} minuten opnieuw.`,
      };

    const message = clampMessage(data.message);
    const list = relevantProducts(message);
    const body: Record<string, unknown> = {
      model: process.env["ASSISTANT_MODEL"] ?? "claude-sonnet-5-5",
      max_tokens: 1024,
      system: buildSystemPrompt({ source: data.source, list }),
      messages: [...data.history.slice(-MAX_HISTORY), { role: "user", content: message }],
    };
    if (data.source === "advisor") {
      body["tools"] = [adviceTool];
      body["tool_choice"] = { type: "tool", name: adviceTool.name };
    }

    let json: { content?: Block[]; usage?: { input_tokens?: number; output_tokens?: number } };
    try {
      const res = await fetch(
        `${process.env["ANTHROPIC_BASE_URL"] ?? "https://api.anthropic.com"}/v1/messages`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
      json = await res.json();
    } catch (error) {
      console.error("[assistant] upstream error", error);
      return {
        ok: false,
        code: "upstream",
        message: "De assistent is tijdelijk niet beschikbaar. Probeer het later opnieuw.",
      };
    }

    const usage = { input: json.usage?.input_tokens ?? 0, output: json.usage?.output_tokens ?? 0 };
    console.info("[assistant]", JSON.stringify({ source: data.source, ...usage }));

    const blocks = json.content ?? [];
    const tool = blocks.find(
      (b): b is Extract<Block, { type: "tool_use" }> => b.type === "tool_use",
    );
    const text = blocks
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("\n")
      .trim();

    const recommendations: Recommendation[] = (tool?.input.recommendations ?? []).flatMap((raw) => {
      const r = raw as { product_id?: unknown; quantity?: unknown; reason?: unknown };
      if (typeof r.product_id !== "string" || !findProduct(r.product_id)) return [];
      const quantity = Math.min(999, Math.max(1, Math.round(Number(r.quantity) || 1)));
      return [{ productId: r.product_id, quantity, reason: String(r.reason ?? "") }];
    });
    const warnings = evaluateSet(
      recommendations.map((r) => ({ id: r.productId, quantity: r.quantity })),
    )
      .filter((r) => r.status === "niet-compatibel")
      .map((r) => r.reason);

    return { ok: true, reply: tool?.input.summary ?? text, recommendations, warnings, usage };
  });
