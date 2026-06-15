/* =============================================================================
 * tokens.ts — {{HOTEL_NAME}}, Mykonos — typed token module
 *
 * theme.css owns everything that becomes a CSS utility (colour, type, spacing,
 * radius, shadow) AND the dark/light "band" flip. This module owns the two
 * things CSS can't:
 *   1. Motion VALUES that JavaScript needs (the scroll-reveal observer).
 *   2. Type-SAFE names for semantic tokens, so any var(--…) you write in TS/JSX
 *      is checked at compile time instead of being a magic string.
 *
 * Keep the motion numbers identical to --duration-* / --ease-* in theme.css.
 * They are intentionally duplicated (small, stable) so JS and CSS agree.
 * ========================================================================== */

/* ----------------------------- Motion ---------------------------------- */
export const duration = {
  fast: 180,
  base: 280,
  slow: 450,
  deliberate: 650,
} as const;

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  entrance: "cubic-bezier(0, 0, 0, 1)",
  exit: "cubic-bezier(0.3, 0, 1, 1)",
} as const;

/** Scroll-reveal defaults — slow + cinematic, consumed by useReveal below. */
export const reveal = {
  rootMargin: "0px 0px -12% 0px", // fire slightly before fully in view
  threshold: 0.12,
  staggerMs: 90, // delay between sibling reveals
} as const;

/* --------------------- Type-safe semantic token names ------------------ */
/** Every semantic colour role in theme.css. These flip per band automatically. */
export type SemanticColor =
  | "surface" | "surface-raised" | "surface-sunken"
  | "text" | "text-muted" | "text-subtle"
  | "primary" | "accent"
  | "cta" | "cta-hover" | "cta-text"
  | "highlight"
  | "border" | "border-strong" | "ring";

export type RadiusToken = "sm" | "md" | "lg" | "xl";
export type ShadowToken = "1" | "2" | "3" | "glow";
export type DurationToken = keyof typeof duration;

/** Build a checked `var(--color-…)` reference for inline styles. */
export const colorVar = (name: SemanticColor) => `var(--color-${name})`;
export const radiusVar = (name: RadiusToken) => `var(--radius-${name})`;
export const shadowVar = (name: ShadowToken) => `var(--shadow-${name})`;
export const durationVar = (name: DurationToken) => `var(--duration-${name})`;

/* ----------------------- IntersectionObserver hook --------------------- */
/* Pairs with `[data-reveal]` / `.is-visible` in theme.css. CSS does the
 * animation; JS only toggles the class. Respects reduced motion. */

import { useEffect, useRef } from "react";

/**
 * Attach to a section. Children marked `data-reveal` fade + rise into view,
 * staggered. Example:
 *   const ref = useReveal<HTMLElement>();
 *   return <section ref={ref}><h2 data-reveal>…</h2><p data-reveal>…</p></section>;
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;

    // Reduced motion: reveal everything immediately, no transforms.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const i = items.indexOf(el);
          el.style.transitionDelay = `${Math.max(0, i) * reveal.staggerMs}ms`;
          el.classList.add("is-visible");
          obs.unobserve(el); // reveal once
        });
      },
      { rootMargin: reveal.rootMargin, threshold: reveal.threshold }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
