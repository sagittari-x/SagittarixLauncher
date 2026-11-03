import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ProjectGallery from "./ProjectGallery.jsx";
import Starfield from "./Starfield.jsx";

const OrbitExperience = lazy(() => import("./OrbitExperience.jsx"));

function AgeGate() {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (sessionStorage.getItem("sagittarix-age-confirmed") !== "true") {
      dialog.showModal();
    }

    const preventDismissal = (event) => event.preventDefault();
    dialog.addEventListener("cancel", preventDismissal);
    return () => dialog.removeEventListener("cancel", preventDismissal);
  }, []);

  const confirmAge = () => {
    sessionStorage.setItem("sagittarix-age-confirmed", "true");
    dialogRef.current?.close();
  };

  return (
    <dialog
      className="age-dialog"
      ref={dialogRef}
      aria-labelledby="age-title"
      aria-describedby="age-description"
    >
      <div className="age-dialog__content">
        <span className="age-dialog__mark" aria-hidden="true">S</span>
        <p className="eyebrow">Before you come in</p>
        <h2 id="age-title">A quick check-in.</h2>
        <p id="age-description">
          Some Sagittarix experiences are intended for adults only. Please confirm that you are at
          least 18 years old to continue.
        </p>
        <button className="button button--light age-dialog__confirm" type="button" onClick={confirmAge}>
          I am 18 or older <span aria-hidden="true">→</span>
        </button>
        <a className="age-dialog__leave" href="https://www.google.com/" rel="noreferrer">
          I am under 18 — leave this site
        </a>
        <p className="age-dialog__fineprint">
          This is a self-attestation, not identity or legal age verification.
        </p>
      </div>
    </dialog>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Sagittarix home" onClick={closeMenu}>
        <span className="wordmark__symbol" aria-hidden="true">S</span>
        <span>Sagittarix</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="menu-toggle__label">Menu</span>
        <span className="menu-toggle__icon" aria-hidden="true"><span /><span /></span>
      </button>
      <nav
        className={`site-nav${menuOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a className="nav-cta" href="#projects" onClick={closeMenu}>
          Explore <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

function Hero({ reducedMotion }) {
  return (
    <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow"><span className="status-dot" aria-hidden="true" /> Independent app studio</p>
        <h1 id="hero-title">Pleasure has its<br /><em>own universe.</em></h1>
        <p className="hero__intro">
          Sagittarix is an independent app studio exploring thoughtful digital experiences, from
          adult-only worlds to useful tools for everyday life.
        </p>
        <div className="hero__actions">
          <a className="button button--light" href="#projects">Explore our universe <span aria-hidden="true">↓</span></a>
          <span className="hero__note">Independent by nature. Thoughtful by design.</span>
        </div>
        <p className="age-note"><span aria-hidden="true">18+</span> Some experiences are for adults only.</p>
      </div>

      <div className="hero-visual">
        <div className="hero-visual__halo hero-visual__halo--one" />
        <div className="hero-visual__halo hero-visual__halo--two" />
        <div className="hero-art" aria-hidden="true">
          {!reducedMotion && (
            <Suspense fallback={null}>
              <OrbitExperience />
            </Suspense>
          )}
        </div>
        <span className="hero-art__label hero-art__label--top">A world of possibility</span>
        <span className="hero-art__label hero-art__label--bottom">Curiosity, in orbit <span>✳</span></span>
        <span className="hero-art__caption">Room for all of it.</span>
      </div>
      <span className="hero__index" aria-hidden="true">S / 01</span>
      <a className="scroll-cue" href="#projects" aria-label="Scroll to projects">
        <span>Scroll to explore</span><i aria-hidden="true" />
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark wordmark--footer" href="#top" aria-label="Sagittarix, back to top">
        <span className="wordmark__symbol" aria-hidden="true">S</span>
        <span>Sagittarix</span>
      </a>
      <p>Independent by nature. Thoughtful by design.</p>
      <p className="site-footer__nasa-note">
        NASA imagery is credited to its respective source. NASA does not endorse Sagittarix.
      </p>
      <div className="site-footer__meta">
        <span>© {new Date().getFullYear()} Sagittarix</span>
        <span>Some experiences are for adults only.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Starfield reducedMotion={reducedMotion} />
      <Header />
      <main id="main">
        <Hero reducedMotion={reducedMotion} />
        <ProjectGallery reducedMotion={reducedMotion} />
      </main>
      <Footer />
      <AgeGate />
    </>
  );
}
