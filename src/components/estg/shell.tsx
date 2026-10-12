import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Headphones,
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
import { brandLogo, brands, categories, products } from "@/lib/catalog";
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
      <span className="brand-bar-name">{brand}</span>
      {logo && (
        <img className="brand-bar-logo" src={logo} alt="" width={88} height={20} loading="lazy" />
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
            <Button
              className="mobile-menu"
              variant="ghost"
              size="icon"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <div className={`main-nav-wrap ${menuOpen ? "open" : ""}`}>
          <nav className="container main-nav" aria-label="Hoofdnavigatie">
            <button
              type="button"
              className="nav-trigger"
              aria-expanded={megaOpen}
              aria-controls="mega-menu"
              onClick={() => setMegaOpen(!megaOpen)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Menu size={18} /> Alle producten
              </span>
              <ChevronDown size={14} />
            </button>
            <Link to="/merken" onClick={close}>
              Merken
            </Link>
            <Link to="/advisor" search={{ vraag: "" }} onClick={close}>
              AI-adviseur
            </Link>
            <Link to="/kennis" onClick={close}>
              Kennis & inspiratie
            </Link>
            <Link to="/over-estg" className="about-nav" onClick={close}>
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
