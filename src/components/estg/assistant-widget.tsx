import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { streamWidget } from "@/lib/assistant/client";
import { MAX_MESSAGE_LENGTH } from "@/lib/assistant/guards";
import { ADVICE_STEPS } from "@/lib/availability";
import { useLoadingStep } from "./ui-bits";
import type { ChatTurn } from "@/lib/assistant/types";

const WIDGET_QUESTIONS = [
  "Welke batterij past bij een hybride omvormer?",
  "Wat is het verschil tussen 1-fase en 3-fase?",
  "Hoeveel panelen passen op een omvormer van 10 kW?",
];
const STORAGE_KEY = "estg_assistant_chat";
const CONV_KEY = "estg_assistant_conversation";
const GREETING: ChatTurn = {
  role: "assistant",
  content:
    "Hoi! Ik beantwoord vragen over het ESTG-assortiment en techniek. Voor een complete productset kun je de AI-adviseur gebruiken.",
};

function readStored(): ChatTurn[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.slice(-20) : [];
  } catch {
    return [];
  }
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef(false);

  // Gesprek hervatten na verversen, pas na hydratie.
  useEffect(() => {
    setTurns(readStored());
    setConversationId(localStorage.getItem(CONV_KEY));
  }, []);
  useEffect(() => {
    try {
      if (!busy) localStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-20)));
    } catch {
      /* opslag niet beschikbaar */
    }
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, open, busy]);

  const step = useLoadingStep(busy && !streaming, ADVICE_STEPS, 3000);

  const send = async (preset?: string) => {
    const message = (preset ?? text).trim();
    if (!message || busy) return;
    setTurns((t) => [...t, { role: "user", content: message }]);
    setText("");
    setBusy(true);
    setStreaming(false);
    try {
      const res = await streamWidget(
        { message, ...(conversationId ? { conversation_id: conversationId } : {}) },
        (full) => {
          const first = !streamingRef.current;
          streamingRef.current = true;
          setStreaming(true);
          setTurns((t) =>
            first
              ? [...t, { role: "assistant", content: full }]
              : [...t.slice(0, -1), { role: "assistant", content: full }],
          );
        },
      );
      if (res.conversationId) {
        setConversationId(res.conversationId);
        localStorage.setItem(CONV_KEY, res.conversationId);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Er ging iets mis. Bel 085 016 7800.";
      setTurns((t) =>
        streamingRef.current
          ? [...t.slice(0, -1), { role: "assistant", content: msg }]
          : [...t, { role: "assistant", content: msg }],
      );
    } finally {
      streamingRef.current = false;
      setBusy(false);
      setStreaming(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="assistant-fab"
        aria-expanded={open}
        aria-label={open ? "Assistent sluiten" : "Vraag het ESTG"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span>Vraag het ESTG</span>}
      </button>
      {open && (
        <section className="assistant-panel" aria-label="ESTG-assistent">
          <div className="assistant-log" aria-live="polite">
            {[GREETING, ...turns].map((t, i) => (
              <p key={i} className={`bubble ${t.role}`}>
                {t.content}
              </p>
            ))}
            {turns.length === 0 && !busy && (
              <div className="chip-row" aria-label="Voorbeeldvragen">
                {WIDGET_QUESTIONS.map((q) => (
                  <button key={q} type="button" onClick={() => void send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            {busy && !streaming && (
              <p className="bubble assistant muted">
                <span className="loading-status">
                  {step}
                  <span className="loading-dots" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </p>
            )}
            <div ref={endRef} />
          </div>
          <p className="assistant-note">
            Wil je een set laten samenstellen?{" "}
            <Link to="/advisor" search={{ vraag: "" }} onClick={() => setOpen(false)}>
              Open de AI-adviseur
            </Link>
          </p>
          <form
            className="assistant-form"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              aria-label="Jouw vraag"
              value={text}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Stel een vraag…"
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={busy || !text.trim()} aria-label="Verstuur">
              <Send />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}
