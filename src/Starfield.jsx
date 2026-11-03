import { useMemo } from "react";

export default function Starfield({ reducedMotion }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 68 }, (_, index) => {
        const seed = index + 1;
        return {
          left: `${(seed * 61.8034) % 100}%`,
          top: `${(seed * 37.719) % 100}%`,
          size: `${1 + ((seed * 13) % 14) / 10}px`,
          delay: `${-((seed * 1.71) % 9).toFixed(2)}s`,
          duration: `${4 + ((seed * 7) % 50) / 10}s`,
          tint: seed % 9 === 0 ? "blue" : seed % 5 === 0 ? "pink" : "white",
        };
      }),
    [],
  );

  return (
    <div
      className={`starfield${reducedMotion ? " starfield--still" : ""}`}
      aria-hidden="true"
    >
      <div className="starfield__nebula starfield__nebula--rose" />
      <div className="starfield__nebula starfield__nebula--blue" />
      <div className="starfield__dust" />
      <div className="starfield__stars">
        {stars.map((star, index) => (
          <span
            className={`starfield__star starfield__star--${star.tint}`}
            key={index}
            style={{
              "--star-left": star.left,
              "--star-top": star.top,
              "--star-size": star.size,
              "--star-delay": star.delay,
              "--star-duration": star.duration,
            }}
          />
        ))}
      </div>
      <svg className="starfield__constellation" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M92 166 171 129 244 206 309 179 378 263 461 232M790 122 868 198 954 169 1010 251 1103 218M607 504 680 449 758 486 822 418 907 452" />
        <circle cx="92" cy="166" r="2" /><circle cx="244" cy="206" r="2" />
        <circle cx="378" cy="263" r="2" /><circle cx="790" cy="122" r="2" />
        <circle cx="954" cy="169" r="2" /><circle cx="1103" cy="218" r="2" />
        <circle cx="607" cy="504" r="2" /><circle cx="758" cy="486" r="2" />
        <circle cx="907" cy="452" r="2" />
      </svg>
    </div>
  );
}
