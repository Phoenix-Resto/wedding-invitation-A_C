"use client";

/** Decorative petals: CSS-only movement, no intervals or React re-renders. */
export function PetalField() {
  return (
    <div className="petal-field" aria-hidden="true">
      {Array.from({ length: 11 }, (_, index) => (
        <span className="petal" key={index} />
      ))}
    </div>
  );
}
