import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Headphones,
  Mail,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandLogo, brands, categories } from "@/lib/catalog";
import { HeaderSearch } from "./search";
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
  const { count } = useStore();
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
            <a href="tel:+31850167800" className="header-link">
              <Phone size={18} />
              <span>+31 (0)85 016 7800</span>
            </a>
            <Link to="/contact" className="header-link" onClick={close}>
              <Headphones size={18} />
              <span>Persoonlijk advies</span>
            </Link>
            <span className="lang" title="Nu beschikbaar in het Nederlands">
              NL
            </span>
            <Link
              to="/winkelwagen"
              className="bag-link"
              aria-label={`Mijn Project, ${count} producten`}
              onClick={close}
            >
              <ShoppingBag size={22} />
              {count > 0 && <span className="bag-count">{count}</span>}
            </Link>
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
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c}
                to="/webshop"
                search={{ category: c, q: "", brand: "" }}
                onClick={close}
              >
                {c}
              </Link>
            ))}
            <Link to="/merken" onClick={close}>
              Merken
            </Link>
            <Link to="/advisor" onClick={close}>
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
            <div className="container mega-grid">
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
            <a href="tel:+31850167800">
              <Phone size={16} /> +31 (0)85 016 7800
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
          <Link to="/winkelwagen">Mijn Project</Link>
          <a href="https://www.estg.eu/nl-nl" target="_blank" rel="noreferrer">
            Huidige ESTG-website
          </a>
        </FooterCol>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ESTG · European Sustainable Technology Group</span>
        <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <Scale size={14} /> Voorbeeldwebsite: geen bestellingen, geen betalingen
        </span>
      </div>
    </footer>
  );
}
