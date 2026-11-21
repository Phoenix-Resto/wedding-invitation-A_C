/**
 * Camera-style scroll timeline.
 *
 * Scroll distance is measured in "scroll units" (one unit is roughly one
 * comfortable swipe). Every scene goes through three phases:
 *   ENTER  – flies in from far away, fast, and settles
 *   DWELL  – drifts slowly closer while it is readable
 *   EXIT   – rushes toward the viewer and fades, quickly
 * The EXIT of a scene overlaps the ENTER of the next one, so the next scene
 * arrives while the previous one is being passed.
 */
export const ENTER = 0.9;
export const DWELL = 1.4;
export const STRIDE = ENTER + DWELL;
/** One scroll unit as a fraction of the viewport height. */
export const UNIT_VH = 0.85;
/** The background travels this many screens per scene (5 scenes ≈ 2 screens). */
export const BG_SCREENS_PER_SCENE = 0.4;

const START_SCALE = 0.22;
const DWELL_END_SCALE = 1.1;
const EXIT_SCALE = 3.4;

export type SceneState = { visible: boolean; active: boolean; scale: number; opacity: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Scroll position (in units) at which scene `i` starts entering. Scene 0 starts already entered. */
export const sceneStart = (i: number) => -ENTER + i * STRIDE;

/** Total scrollable distance (in units) for `n` scenes. */
export const totalUnits = (n: number) => (n - 1) * STRIDE + DWELL;

export function sceneState(t: number, isLast: boolean): SceneState {
  if (t <= 0) return { visible: false, active: false, scale: START_SCALE, opacity: 0 };

  if (t < ENTER) {
    const k = t / ENTER;
    const ease = 1 - Math.pow(1 - k, 3);
    return {
      visible: true,
      active: k > 0.6,
      scale: START_SCALE + (1 - START_SCALE) * ease,
      opacity: clamp01(k / 0.55),
    };
  }

  const dwellEnd = ENTER + DWELL;
  if (t < dwellEnd || isLast) {
    const k = clamp01((t - ENTER) / DWELL);
    return { visible: true, active: true, scale: 1 + (DWELL_END_SCALE - 1) * k, opacity: 1 };
  }

  const k = (t - dwellEnd) / ENTER;
  if (k >= 1) return { visible: false, active: false, scale: EXIT_SCALE, opacity: 0 };
  return {
    visible: true,
    active: k < 0.3,
    scale: DWELL_END_SCALE + (EXIT_SCALE - DWELL_END_SCALE) * Math.pow(k, 2.2),
    opacity: 1 - clamp01((k - 0.05) / 0.7),
  };
}
