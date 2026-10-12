import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useLocation,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer, Logo } from "@/components/estg/shell";
import { Button } from "@/components/ui/button";
import { StoreProvider } from "@/components/estg/store";
import { CompareProvider } from "@/components/estg/compare";
import { AuthProvider } from "@/components/estg/auth";
import { FavoritesProvider } from "@/components/estg/favorites";
import { TrainingsProvider } from "@/components/estg/trainings";
import { Toaster } from "@/components/ui/sonner";
import { CompareBar } from "@/components/estg/compare-bar";
import { CommandPalette } from "@/components/estg/command-palette";
import { CookieBanner } from "@/components/estg/cookie-banner";
import { RouteProgress } from "@/components/estg/route-progress";
import { ScrollTop } from "@/components/estg/scroll-top";
import { AssistantWidget } from "@/components/estg/assistant-widget";

function NotFoundComponent() {
  return (
    <section className="container empty-state" style={{ paddingBlock: 96 }}>
      <Logo />
      <h1>Pagina niet gevonden</h1>
      <p>
        Deze pagina bestaat niet of is verplaatst. Ga terug naar de homepage of bekijk het
        assortiment.
      </p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <Button asChild>
          <Link to="/">Naar de homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/webshop" search={{ q: "", category: "", brand: "" }}>
            Naar de webshop
          </Link>
        </Button>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Deze pagina laadde niet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Er ging iets mis aan onze kant. Probeer het opnieuw of ga terug naar de homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Naar de homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ESTG" },
      { property: "og:locale", content: "nl_NL" },
      { property: "og:title", content: "ESTG | Leading in positive energy" },
      {
        property: "og:description",
        content:
          "ESTG, jouw B2B-partner voor zonnepanelen, omvormers, energieopslag en EV-laders voor professionals.",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#00183D" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-64.png", type: "image/png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Mono:wght@500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Korte fade/slide-in van de paginainhoud bij elke routewissel (op pad, niet op zoekparameters). */
function PageTransition() {
  const pathname = useLocation({ select: (l) => l.pathname });
  return (
    <div key={pathname} className="page-enter">
      <Outlet />
    </div>
  );
}

/** Schudt een ongeldig formulierveld even zodat de fout opvalt (naast de standaard melding). */
function useInvalidShake() {
  useEffect(() => {
    const onInvalid = (e: Event) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      el.classList.remove("field-shake");
      void el.offsetWidth;
      el.classList.add("field-shake");
      el.addEventListener("animationend", () => el.classList.remove("field-shake"), {
        once: true,
      });
    };
    document.addEventListener("invalid", onInvalid, true);
    return () => document.removeEventListener("invalid", onInvalid, true);
  }, []);
}

function RootComponent() {
  useInvalidShake();
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <TrainingsProvider>
          <StoreProvider>
            <CompareProvider>
              <Header />
              <main>
                <PageTransition />
              </main>
              <Footer />
              <CompareBar />
              <AssistantWidget />
              <ScrollTop />
              <CookieBanner />
              <CommandPalette />
              <RouteProgress />
              <Toaster />
            </CompareProvider>
          </StoreProvider>
          </TrainingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
