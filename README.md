# Wedding Invitation A & C — Phase 1 (opening depth correction)

A mobile-first React + Vite + TypeScript wedding invitation. This patch preserves the existing splash, grounded background, petals, and 11 optimized WebP opening images. It changes the envelope motion and places **Open Card** immediately below the resting card, sharing its visual ground plane.

## Run on your phone

```powershell
npm install
npm run dev
```

Open the Vite network/LAN URL on your phone (same Wi-Fi). To check a production build:

```powershell
npm run typecheck
npm run build
```

## Animation sequence

1. **Splash:** fades in at rest, with a thick loading line and a travelling petal; fades away.
2. **Cover:** oversized above the screen, falls inward and gently settles.
3. **Open Card:** slides up and fades in directly **beneath the cover**, resting near its lower edge instead of floating at a fixed viewport position. On tap it drops downward.
4. **Frame 02 / 03:** closed envelope at the original grounded size and depth.
5. **Frame 04:** begins rising (slightly enlarged to compensate for the camera having zoomed out).
6. **Frame 05:** continues rising, scaling up and moving slightly upward.
7. **Frames 06–10:** fully raised; the card is larger than the phone viewport and intentionally clipped at the edges, as if it has moved close to the viewer.
8. **Frame 11:** starts at the raised size, then begins the descent while the photo is still displayed.
9. **Frame 12:** drops back to the original resting size with a soft landing; remains visible until the next phase.

The raised scale is calculated from the actual card height and viewport height, so tall phone screens also get a full-bleed raised look. The WebP assets retain their original aligned **1200 × 1600** transparent canvases and are **not** cropped or replaced. The motion is expressed using responsive CSS transforms. Timings and per-frame scale choices are in `src/App.tsx`; animation details are in `src/styles.css`.

## Interactions and accessibility

Mobile tap highlight, usual touch-callout, dragging and selection are suppressed where supported. Keyboard focus remains visible. `prefers-reduced-motion` shortens motion and leaves the final frame grounded. These settings do not prevent screenshots or a visitor accessing public image files.

## Delta patch application

This ZIP is a **delta-only overlay** on top of `wedding-invitation-A_C-phase1-grounded-motion-patch.zip` (with the earlier opening frames installed). Extract its contents into the existing repository root, preserving relative paths. It replaces only `src/App.tsx`, `src/styles.css`, and `README.md`; no image changes and no deletions.
