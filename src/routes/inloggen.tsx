import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/estg/auth";
import { Logo } from "@/components/estg/shell";
import { pageHead } from "@/lib/catalog";
import rooftop from "@/assets/solar-rooftop.jpg";

export const Route = createFileRoute("/inloggen")({
  head: () =>
    pageHead("Inloggen", "Log in of maak een zakelijk ESTG-account aan om favorieten op te slaan."),
  validateSearch: (s: Record<string, unknown>): { reason?: "bestellen"; returnTo?: "/bestellen" } => ({
    reason: s.reason === "bestellen" ? "bestellen" : undefined,
    returnTo: s.returnTo === "/bestellen" ? "/bestellen" : undefined,
  }),
  component: SignIn,
});

function SignIn() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { reason, returnTo } = Route.useSearch();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Al ingelogd of net ingelogd: door naar het account.
  useEffect(() => {
    if (!loading && user) {
      if (returnTo === "/bestellen") navigate({ to: "/bestellen", replace: true });
      else navigate({ to: "/account", search: { tab: "favorieten" }, replace: true });
    }
  }, [loading, user, navigate, returnTo]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    setBusy(true);
    setError(null);
    setNotice(null);
    if (mode === "login") {
      const res = await signIn(email, password);
      if (res.error) setError(res.error);
    } else {
      const res = await signUp({
        fullName: String(f.get("name") ?? "").trim(),
        companyName: String(f.get("company") ?? "").trim(),
        email,
        password,
      });
      if (res.error) setError(res.error);
      else if (res.needsConfirmation)
        setNotice(
          "Bijna klaar: we hebben een bevestigingsmail gestuurd. Klik op de link om in te loggen.",
        );
    }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src={rooftop} alt="" width={1920} height={1024} />
        <blockquote>Leading in positive energy</blockquote>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <Link to="/" aria-label="ESTG home">
            <Logo />
          </Link>
          <div className="auth-toggle" data-mode={mode} role="tablist">
            {(
              [
                ["login", "Inloggen"],
                ["register", "Account aanmaken"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setNotice(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {reason === "bestellen" && !notice && (
            <div className="form-note" role="status">
              Log in om je bestelling af te ronden.
            </div>
          )}
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          {notice && (
            <div className="form-note" role="status">
              {notice}
            </div>
          )}
          <form onSubmit={submit}>
            {mode === "register" && (
              <>
                <div className="field">
                  <label htmlFor="name">Naam</label>
                  <input id="name" name="name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="company">Bedrijfsnaam</label>
                  <input id="company" name="company" required autoComplete="organization" />
                </div>
              </>
            )}
            <div className="field">
              <label htmlFor="email">E-mailadres</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Wachtwoord</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={mode === "register" ? 8 : undefined}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={busy}
              style={{ width: "100%" }}
            >
              {busy ? "Even geduld…" : mode === "login" ? "Inloggen" : "Account aanmaken"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
