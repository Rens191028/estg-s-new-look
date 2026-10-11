export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Recommendation = { productId: string; quantity: number; reason: string };

export type AssistantResult =
  | {
      ok: true;
      reply: string;
      recommendations: Recommendation[];
      /** Door code vastgestelde waarschuwingen over de aanbevolen set. */
      warnings: string[];
      usage: { input: number; output: number };
    }
  | {
      ok: false;
      code: "rate_limited" | "not_configured" | "upstream" | "invalid";
      message: string;
    };
