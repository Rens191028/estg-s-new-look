import type { Recommendation } from "./types";

export const ASSISTANT_FALLBACK = "Bel ons gerust op 085 016 7800 (ma-vr 8:30-17:30).";

/** Anonieme sessiesleutel per browser; koppelt gesprekken en de rate limit aan deze bezoeker. */
export function sessionKey() {
  const k = "estg_assistant_session";
  let v = localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID() + crypto.randomUUID();
    localStorage.setItem(k, v);
  }
  return v;
}

type Body = { message: string; source: "widget" | "advisor"; conversation_id?: string };

async function post(body: Body) {
  const res = await fetch("/api/assistant-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, session_key: sessionKey(), page_context: location.pathname }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? `Er ging iets mis. ${ASSISTANT_FALLBACK}`);
  }
  return res;
}

export async function streamWidget(
  body: Omit<Body, "source">,
  onText: (full: string) => void,
): Promise<{ conversationId: string | null; text: string }> {
  const res = await post({ ...body, source: "widget" });
  const conversationId = res.headers.get("X-Conversation-Id");
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    onText(text);
  }
  if (!text.trim()) throw new Error(`De assistent gaf geen antwoord. ${ASSISTANT_FALLBACK}`);
  return { conversationId, text };
}

export type AdviceResult = { reply: string; recommendations: Recommendation[]; warnings: string[] };

export async function requestAdvice(message: string): Promise<AdviceResult> {
  const res = await post({ message, source: "advisor" });
  return res.json();
}
