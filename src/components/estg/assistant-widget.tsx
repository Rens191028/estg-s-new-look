import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { askAssistant } from "@/lib/assistant/chat.functions";
import { MAX_MESSAGE_LENGTH } from "@/lib/assistant/guards";
import type { ChatTurn } from "@/lib/assistant/types";

const STORAGE_KEY = "estg_assistant_chat";
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
  const ask = useServerFn(askAssistant);
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Gesprek hervatten na verversen, pas na hydratie.
  useEffect(() => setTurns(readStored()), []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-20)));
    } catch {
      /* opslag niet beschikbaar */
    }
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, open]);

  const send = async () => {
    const message = text.trim();
    if (!message || busy) return;
    const history = turns.slice(-6);
    setTurns([...turns, { role: "user", content: message }]);
    setText("");
    setBusy(true);
    try {
      const res = await ask({ data: { source: "widget", message, history } });
      setTurns((t) => [...t, { role: "assistant", content: res.ok ? res.reply : res.message }]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "assistant", content: "Er ging iets mis. Probeer het zo opnieuw." },
      ]);
    } finally {
      setBusy(false);
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
            {busy && <p className="bubble assistant muted">Even denken…</p>}
            <div ref={endRef} />
          </div>
          <p className="assistant-note">
            Wil je een set laten samenstellen?{" "}
            <Link to="/advisor" onClick={() => setOpen(false)}>
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
