# Sagittarix

Sagittarix is an independent, one-person app studio creating thoughtful digital products: adult-only experiences as well as useful tools for everyday life. This repository contains the studio's English-language marketing site.

## Project goals

- Explain what Sagittarix is and the kinds of products it creates.
- Give the site a consistent astronomy theme with the tagline "Pleasure has its own universe."
- Keep the page focused on the hero and a full-screen, horizontally browsable project gallery.
- Showcase future project concepts without implying that they are released products.
- Present adult products as intended for adults without showing explicit imagery or descriptions.
- Provide a responsive, accessible starting point that can be hosted as a static website.
- Use React and Three.js for reusable interface components and a custom, animated 3D hero.
- Respect reduced-motion preferences and avoid rendering the 3D scene when motion is reduced.

## Requirements and assumptions

- The page is an informational marketing site, not an app store, payment flow, or adult-content hosting platform.
- A first-visit, self-attested 18+ dialog is included as a basic UX gate.
- The age dialog is **not** identity or legally compliant age verification. Before promoting or linking to adult content, assess applicable laws and add an appropriate age-assurance solution where required.
- No products, contact details, social profiles, or launch dates are invented. Add verified information before publishing those details.
- The interface and all site copy are in English.

## Technology

- React for the component-based interface and interactive behavior.
- Vite for local development and optimized static production builds.
- Three.js with React Three Fiber for the animated, original 3D hero scene.
- CSS for responsive layouts, a fixed starfield, perspective card effects, and reduced-motion support.
- NASA Images and Video Library photographs stored locally and credited in the project cards.
- No backend, analytics, remote image requests, third-party fonts, or runtime API calls.

React and Three.js add dependencies compared with a static page, but they are justified here by the custom 3D scene, animation lifecycle, and reusable UI. React Three Fiber lets the Three.js scene live alongside normal React components; Three.js is the 3D engine (not a package called "tree.js").

## Project files

- `index.html` — document metadata and Vite entry point.
- `src/main.jsx` — React application entry point.
- `src/App.jsx` — page components, 3D scene, motion preferences, navigation, and age dialog.
- `src/Starfield.jsx` — decorative, fixed starfield background.
- `src/ProjectGallery.jsx` — horizontally draggable gallery of clearly labeled future-project concepts.
- `src/assets/nasa/` — NASA space images used as locally bundled concept artwork.
- `src/styles.css` — responsive design, interaction states, animations, and reduced-motion rules.
- `vite.config.js` — Vite and React plugin configuration.
- `package.json` — scripts and dependencies.

## Local development

Requirements: Node.js 20.19+ and npm.

Install dependencies once:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Use the local URL printed by Vite. Create and locally preview a production build with:

```powershell
npm run build
npm run preview
```

The production-ready static files are written to `dist/`.

## Animation and performance

- The hero scene uses an animated sun-like sphere with a procedurally generated magenta-purple plasma texture, concentrated luminous active regions, orbital rings, small satellites, and a star field.
- The visual accent palette combines pink, red, and blue against the existing dark background; no green-yellow accent colors remain.
- The fixed starfield stays in place as the page scrolls; only star opacity twinkles, and the background does not use parallax.
- The project gallery follows the supplied portfolio's full-bleed image cards, dark hover overlay, hover-revealed project title, horizontal drag, and perspective tilt. Touch users see card details without needing hover.
- All five NASA photographs are stored locally; NASA source links and creator credits are shown in each card. NASA does not endorse Sagittarix.
- The cards are explicitly labeled as unreleased future concepts and do not claim to represent existing apps.
- Gallery cards support touch and horizontal scrolling, mouse dragging, keyboard arrow navigation, keyboard focus, and reduced-motion behavior.
- Scene movement responds subtly to the pointer and runs on the GPU; the canvas uses a capped device-pixel ratio and a low-power rendering preference.
- The 3D experience is lazy-loaded separately from the main interface, and a CSS illustration is provided when WebGL is unavailable.
- The Three.js engine is a separate on-demand chunk (about 189 kB gzip); the main React entry is about 69 kB gzip before browser caching.
- Decorative CSS motion is intentionally restrained.
- When `prefers-reduced-motion: reduce` is enabled, the 3D canvas is not mounted, the starfield does not twinkle, gallery scrolling is immediate, and perspective tilt is disabled.

## NASA image credits

The images are from the NASA Images and Video Library and are included as illustrative concept artwork. Each card links to its NASA source record and shows its creator credit.

| Local asset | NASA image | Credit |
| --- | --- | --- |
| `src/assets/nasa/nasa-dumbbell-nebula.jpg` | [PIA14417 — Dumbbell Nebula](https://images.nasa.gov/details/PIA14417) | NASA/JPL-Caltech/Harvard-Smithsonian CfA |
| `src/assets/nasa/nasa-helix-nebula.jpg` | [PIA07902 — Helix Nebula](https://images.nasa.gov/details/PIA07902) | NASA/JPL-Caltech/SSC |
| `src/assets/nasa/nasa-star-cluster.jpg` | [PIA14096 — Star Cluster NGC 2259](https://images.nasa.gov/details/PIA14096) | NASA/JPL-Caltech/UCLA |
| `src/assets/nasa/nasa-andromeda-galaxy.jpg` | [PIA04921 — Andromeda Galaxy](https://images.nasa.gov/details/PIA04921) | NASA/JPL/California Institute of Technology |
| `src/assets/nasa/nasa-w49b-supernova.jpg` | [W49B — Supernova Remnant](https://images.nasa.gov/details/GSFC_20171208_Archive_e002134) | NASA/CXC/SSC; Caltech/SSC/J. Rho and T. Jarrett |

NASA imagery is used without NASA logos or employee likenesses and is not intended to imply NASA's endorsement. Review the [NASA Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) before reusing these assets, especially in promotional or commercial contexts.

## Before launch

1. Review the copy and ensure every claim reflects the actual studio and products.
2. Add a real contact method and any verified product, social, or support links.
3. Publish a privacy notice and terms appropriate to the products and jurisdictions served.
4. Assess age-assurance, consumer-protection, accessibility, and other legal requirements for every target market. A self-attestation dialog alone may not satisfy them.
5. If analytics, embeds, forms, or other third-party services are added, document the data collected and update consent and privacy behavior accordingly.
6. Host over HTTPS and test the finished page on mobile, desktop, keyboard, and assistive technology, including reduced-motion settings and browsers without WebGL.

## Accessibility and privacy notes

- The page uses semantic landmarks, a skip link, visible focus styles, keyboard-operable navigation, and arrow-key gallery scrolling.
- The age confirmation is held in `sessionStorage` for the current browser tab session; it is not an age-verification service.
- The page does not currently submit a form, set cookies, collect personal information, or load external media.
- Respect for reduced-motion preferences is built into the application and stylesheet.
