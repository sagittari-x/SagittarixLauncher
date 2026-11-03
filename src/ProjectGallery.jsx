import { useRef } from "react";
import andromedaImage from "./assets/nasa/nasa-andromeda-galaxy.jpg";
import dumbbellImage from "./assets/nasa/nasa-dumbbell-nebula.jpg";
import helixImage from "./assets/nasa/nasa-helix-nebula.jpg";
import clusterImage from "./assets/nasa/nasa-star-cluster.jpg";
import supernovaImage from "./assets/nasa/nasa-w49b-supernova.jpg";

const concepts = [
  {
    name: "Sirius",
    image: dumbbellImage,
    imageTitle: "Dumbbell Nebula",
    nasaId: "PIA14417",
    credit: "NASA/JPL-Caltech/Harvard-Smithsonian CfA",
  },
  {
    name: "Vega",
    image: helixImage,
    imageTitle: "Helix Nebula",
    nasaId: "PIA07902",
    credit: "NASA/JPL-Caltech/SSC",
  },
  {
    name: "Betelgeuse",
    image: clusterImage,
    imageTitle: "Star Cluster NGC 2259",
    nasaId: "PIA14096",
    credit: "NASA/JPL-Caltech/UCLA",
  },
  {
    name: "Polaris",
    image: andromedaImage,
    imageTitle: "Andromeda Galaxy",
    nasaId: "PIA04921",
    credit: "NASA/JPL/California Institute of Technology",
  },
  {
    name: "Rigel",
    image: supernovaImage,
    imageTitle: "Supernova Remnant W49B",
    nasaId: "GSFC_20171208_Archive_e002134",
    credit: "NASA/CXC/SSC; Caltech/SSC/J. Rho and T. Jarrett",
  },
];

function resetCardTilt(card) {
  if (!card) return;
  card.classList.remove("is-tilting");
  card.style.setProperty("--card-rotate-x", "0deg");
  card.style.setProperty("--card-rotate-y", "0deg");
  card.style.setProperty("--card-scale", "1");
}

function ProjectCard({ concept, index, reducedMotion }) {
  const handlePointerMove = (event) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const card = event.currentTarget.querySelector(".project-card");
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    card.classList.add("is-tilting");
    card.style.setProperty("--card-rotate-x", `${y / 20}deg`);
    card.style.setProperty("--card-rotate-y", `${-x / 20}deg`);
    card.style.setProperty("--card-scale", "1.05");
  };

  return (
    <li
      className="project-gallery__item"
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetCardTilt(event.currentTarget.querySelector(".project-card"))}
    >
      <article
        className="project-card"
        tabIndex={0}
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${concepts.length}: ${concept.name}, future project concept, not released`}
      >
        <img
          className="project-card__image"
          src={concept.image}
          alt={`${concept.imageTitle}, a NASA space image used as concept artwork`}
          loading="lazy"
          decoding="async"
        />
        <span className="project-card__shade" aria-hidden="true" />
        <div className="project-card__details">
          <div className="project-card__title-row">
            <div>
              <p className="project-card__eyebrow">Concept {String(index + 1).padStart(2, "0")} · Not released</p>
              <h3>{concept.name}</h3>
            </div>
            <span className="project-card__arrow" aria-hidden="true">↗</span>
          </div>
          <p className="project-card__type">Future project concept</p>
          <a
            className="project-card__credit"
            href={`https://images.nasa.gov/details/${concept.nasaId}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`View NASA source for ${concept.imageTitle}, credited to ${concept.credit}`}
          >
            NASA image: {concept.imageTitle} <span>· {concept.credit}</span>
          </a>
        </div>
      </article>
    </li>
  );
}

export default function ProjectGallery({ reducedMotion }) {
  const trackRef = useRef(null);
  const dragRef = useRef({ pointerId: null, startX: 0, startScrollLeft: 0, moved: false });

  const moveTrack = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(".project-gallery__item");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 32;
    const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.8;

    track.scrollBy({ left: direction * distance, behavior: "auto" });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || event.target.closest("a, button")) return;
    const track = trackRef.current;
    if (!track) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    };
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) {
      drag.moved = true;
      track.classList.add("is-dragging");
    }
    if (drag.moved) track.scrollLeft = drag.startScrollLeft - distance;
  };

  const endPointerDrag = (event) => {
    const track = trackRef.current;
    if (!track || dragRef.current.pointerId !== event.pointerId) return;

    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    track.classList.remove("is-dragging");
    dragRef.current = { pointerId: null, startX: 0, startScrollLeft: 0, moved: false };
  };

  const handleTrackKeyDown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveTrack(event.key === "ArrowRight" ? 1 : -1);
    }
  };

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="projects__veil" aria-hidden="true" />
      <div className="projects__rule" aria-hidden="true">
        <h2 className="projects__title" id="projects-title">Projects</h2>
      </div>
      <p className="projects__hint" id="projects-hint">Drag to explore · Use arrow keys when focused</p>
      <ul
        className="project-gallery__track"
        ref={trackRef}
        aria-label="Future project concepts illustrated with NASA space imagery; no apps shown are released"
        aria-describedby="projects-hint"
        tabIndex={0}
        onKeyDown={handleTrackKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
      >
        {concepts.map((concept, index) => (
          <ProjectCard
            concept={concept}
            index={index}
            key={concept.name}
            reducedMotion={reducedMotion}
          />
        ))}
      </ul>
    </section>
  );
}
