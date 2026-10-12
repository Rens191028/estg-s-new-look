import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Headphones,
  Info,
  Percent,
  LogOut,
  Sparkles,
  Tag,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { brandLogo, brands, categories, products, solidBrandLogos } from "@/lib/catalog";
import { HeaderSearch } from "./search";
import { formatEuro } from "@/lib/format";
import { COMPANY, COMPANY_ADDRESS, MAP_LINK_URL } from "@/lib/company";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firstName, useAuth } from "./auth";
import { useStore } from "./store";
import { CategoryIcon } from "./ui-bits";

// Het officiële logo is volledig gekleurd en heeft geen inverse variant: alleen op lichte vlakken plaatsen.
export function Logo() {
  return (
    <img
      className="logo"
      src="/brand/estg-logo.png"
      alt="ESTG, Leading in Positive Energy"
      width={187}
      height={52}
    />
  );
}

function BrandLink({ brand, hidden }: { brand: string; hidden: boolean }) {
  const logo = brandLogo(brand);
  return (
    <Link
      to="/webshop"
      search={{ q: "", category: "", brand }}
      tabIndex={hidden ? -1 : undefined}
      className="brand-bar-item"
      aria-label={brand}
    >
      {logo ? (
        <img
          className={`brand-bar-logo ${solidBrandLogos.has(brand) ? "brand-bar-logo--solid" : ""}`}
          src={logo}
          alt=""
          width={88}
          height={20}
        />
      ) : (
        // Merken zonder logobestand blijven als tekst staan, zodat ze niet uit de balk verdwijnen.
        <span className="brand-bar-name">{brand}</span>
      )}
    </Link>
  );
}

function BrandBar() {
  const set = (hidden: boolean) => (
    <div className="brand-bar-set" aria-hidden={hidden || undefined}>
      {brands.map((b) => (
        <BrandLink key={b} brand={b} hidden={hidden} />
      ))}
    </div>
  );
  return (
    <div className="brand-bar" aria-label="Merken bij ESTG">
      <div className="brand-bar-inner">
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onOpenChange,
  count,
  subtotal,
  loggedIn,
  onSignOut,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  subtotal: number;
  loggedIn: boolean;
  onSignOut: () => void;
}) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="mobile-menu" variant="ghost" size="icon" aria-label="Menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="mobile-sheet">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav aria-label="Mobiel menu" className="mobile-nav">
          <Link to="/webshop" search={{ q: "", category: "", brand: "" }} onClick={close}>
            <Menu size={20} /> Alle producten
          </Link>
          <div className="mobile-sub">
            {categories.map((c) => (
              <Link
                key={c}
                to="/webshop"
                search={{ category: c, q: "", brand: "" }}
                onClick={close}
              >
                <CategoryIcon category={c} size={16} /> {c}
              </Link>
            ))}
          </div>
          <Link to="/aanbiedingen" onClick={close}>
            <Percent size={20} /> Aanbiedingen
          </Link>
          <Link to="/merken" onClick={close}>
            <Tag size={20} /> Merken
          </Link>
          <Link to="/advisor" search={{ vraag: "" }} onClick={close}>
            <Sparkles size={20} /> AI-adviseur
          </Link>
          <Link to="/kennis" onClick={close}>
            <BookOpen size={20} /> Kennis & inspiratie
          </Link>
          <Link to="/over-estg" onClick={close}>
            <Info size={20} /> Over ESTG
          </Link>
          <div className="mobile-divider" />
          {loggedIn ? (
            <>
              <Link to="/account" search={{ tab: "favorieten" }} onClick={close}>
                <User size={20} /> Mijn account
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  onSignOut();
                }}
              >
                <LogOut size={20} /> Uitloggen
              </button>
            </>
          ) : (
            <Link to="/inloggen" onClick={close}>
              <User size={20} /> Inloggen
            </Link>
          )}
          <Link to="/winkelwagen" onClick={close}>
            <ShoppingBag size={20} /> Winkelmand
            {count > 0 && (
              <span className="mobile-count">
                {count} · {formatEuro(subtotal)}
              </span>
            )}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { count, subtotal } = useStore();
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);
  const previousCount = useRef(count);
  // Korte "pop" op de pil zodra er iets aan de winkelmand is toegevoegd.
  useEffect(() => {
    const grew = count > previousCount.current;
    previousCount.current = count;
    if (!grew) return undefined;
    setPop(true);
    const t = setTimeout(() => setPop(false), 500);
    return () => clearTimeout(t);
  }, [count]);
  const pathname = useLocation({ select: (l) => l.pathname });
  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  const cls = (prefix: string) => (isActive(prefix) ? "is-active" : "");
  const onShop = isActive("/webshop") || isActive("/producten");
  const popular = products.filter((p) => p.isBestseller).slice(0, 4);
  const close = () => {
    setMenuOpen(false);
    setMegaOpen(false);
  };
  return (
    <>
      <BrandBar />
      <header className="site-header">
        <div className="container main-header">
          <Link to="/" aria-label="ESTG home" onClick={close}>
            <Logo />
          </Link>
          <HeaderSearch />
          <div className="header-actions">
            <span className="lang" title="Nu beschikbaar in het Nederlands">
              NL
            </span>
            <Link
              to="/winkelwagen"
              className={`bag-pill ${count > 0 ? "bag-pill--filled" : ""} ${pop ? "bag-pill--pop" : ""}`}
              aria-label={`Winkelmand, ${count} producten${count > 0 ? `, ${formatEuro(subtotal)} excl. btw` : ""}`}
              onClick={close}
            >
              <ShoppingBag size={20} />
              <span className="bag-pill-label" aria-hidden={count === 0}>
                {count} · {formatEuro(subtotal)}
              </span>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="header-link account-trigger" aria-label="Account">
                  <User size={20} />
                  <span>{firstName(profile)}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(
                    [
                      ["favorieten", "Favorieten"],
                      ["gegevens", "Gegevens"],
                      ["bestellingen", "Bestellingen"],
                    ] as const
                  ).map(([tab, label]) => (
                    <DropdownMenuItem
                      key={tab}
                      onSelect={() => navigate({ to: "/account", search: { tab } })}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      await signOut();
                      navigate({ to: "/" });
                    }}
                  >
                    Uitloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/inloggen" className="header-link" onClick={close} aria-busy={loading}>
                <User size={20} />
                <span>Inloggen</span>
              </Link>
            )}
            <MobileMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              count={count}
              subtotal={subtotal}
              loggedIn={!!user}
              onSignOut={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
            />
          </div>
        </div>
        <div className="main-nav-wrap">
          <nav className="container main-nav" aria-label="Hoofdnavigatie">
            <button
              type="button"
              className={`nav-trigger ${onShop ? "is-active" : ""}`}
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              aria-current={onShop ? "page" : undefined}
              onClick={() => setMegaOpen(!megaOpen)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Menu size={18} /> Alle producten
              </span>
              <ChevronDown size={14} />
            </button>
            <Link
              to="/aanbiedingen"
              onClick={close}
              className={`nav-deals ${cls("/aanbiedingen")}`}
              aria-current={isActive("/aanbiedingen") ? "page" : undefined}
            >
              Aanbiedingen
            </Link>
            <Link
              to="/merken"
              onClick={close}
              className={cls("/merken")}
              aria-current={isActive("/merken") ? "page" : undefined}
            >
              Merken
            </Link>
            <Link
              to="/advisor"
              search={{ vraag: "" }}
              onClick={close}
              className={cls("/advisor")}
              aria-current={isActive("/advisor") ? "page" : undefined}
            >
              AI-adviseur
            </Link>
            <Link
              to="/kennis"
              onClick={close}
              className={cls("/kennis")}
              aria-current={isActive("/kennis") ? "page" : undefined}
            >
              Kennis & inspiratie
            </Link>
            <Link
              to="/over-estg"
              onClick={close}
              className={`about-nav ${cls("/over-estg")}`}
              aria-current={isActive("/over-estg") ? "page" : undefined}
            >
              Over ESTG <ArrowUpRight size={14} />
            </Link>
          </nav>
        </div>
        {megaOpen && (
          <div className="mega" id="mega-menu">
            <div className="container mega-inner">
              <div>
                <h3 className="mega-title">Categorieën</h3>
                <div className="mega-grid">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to="/webshop"
                      search={{ category: c, q: "", brand: "" }}
                      onClick={close}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CategoryIcon category={c} size={20} /> {c}
                      </span>
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mega-popular">
                <h3 className="mega-title">Populair</h3>
                {popular.map((p) => (
                  <Link key={p.id} to="/producten/$id" params={{ id: p.id }} onClick={close}>
                    {p.image ? (
                      <img src={p.image} alt="" width={44} height={44} />
                    ) : (
                      <span className="mega-thumb">
                        <CategoryIcon category={p.category} size={20} />
                      </span>
                    )}
                    <span>
                      {p.name}
                      <small>{p.brand}</small>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function Benefits() {
  return (
    <div className="benefits">
      <div className="container benefits-inner">
        <span>
          <Truck /> Europese distributie
        </span>
        <span>
          <ShieldCheck /> Toonaangevende A-merken
        </span>
        <span>
          <Headphones /> Expertise voor jouw project
        </span>
        <span>
          <Zap /> Exclusief voor professionals
        </span>
      </div>
    </div>
  );
}

function FooterCol({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`footer-col ${open ? "open" : ""} ${className}`.trim()}>
      <button
        type="button"
        className="footer-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <h4>{title}</h4>
        <ChevronDown size={18} className="chev" />
      </button>
      <div className="footer-body">{children}</div>
    </div>
  );
}

function NewsletterRow() {
  const [done, setDone] = useState(false);
  return (
    <div className="container newsletter">
      <div>
        <h4>Blijf op de hoogte</h4>
        <p>Nieuws over assortiment en kennis voor installateurs.</p>
      </div>
      {done ? (
        <p role="status" className="newsletter-done">
          Bedankt! Dit is een voorbeeld: er is niets verzonden of opgeslagen.
        </p>
      ) : (
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <input type="email" required aria-label="E-mailadres" placeholder="naam@bedrijf.nl" />
          <Button type="submit" variant="accent">
            Aanmelden
          </Button>
        </form>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Link to="/" aria-label="ESTG home" className="footer-logo">
            <Logo />
          </Link>
          <p>Jouw partner in de energietransitie.</p>
          <div className="footer-contact">
            <a href={COMPANY.phoneHref}>
              <Phone size={16} /> {COMPANY.phone}
            </a>
            <a href={MAP_LINK_URL} target="_blank" rel="noreferrer">
              <MapPin size={16} /> {COMPANY_ADDRESS}
            </a>
            <Link to="/contact">
              <Mail size={16} /> Contact opnemen
            </Link>
          </div>
        </div>
        <FooterCol title="Assortiment">
          {categories.map((c) => (
            <Link key={c} to="/webshop" search={{ category: c, q: "", brand: "" }}>
              {c}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="Klantenservice">
          <Link to="/contact">Contact</Link>
          <Link to="/kennis">Kennis & inspiratie</Link>
          <Link to="/merken">Onze merken</Link>
          <Link to="/vergelijken">Producten vergelijken</Link>
        </FooterCol>
        <FooterCol title="Ontdek ESTG">
          <Link to="/over-estg">Over ons</Link>
          <Link to="/winkelwagen">Winkelmand</Link>
          <a href="https://www.estg.eu/nl-nl" target="_blank" rel="noreferrer">
            Huidige ESTG-website
          </a>
        </FooterCol>
      </div>
      <NewsletterRow />
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ESTG · European Sustainable Technology Group</span>
        <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <Scale size={14} /> Voorbeeldwebsite: geen bestellingen, geen betalingen
        </span>
      </div>
    </footer>
  );
}
