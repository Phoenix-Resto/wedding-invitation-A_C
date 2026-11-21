# Wedding Invitation A & C — Phase 1 (opening sequence update)

Mobile-first React + Vite + TypeScript wedding invitation. Includes the splash, cover and the **actual 2.png–12.png opening animation**. It intentionally stops at the opened card; the invitation text and later sections are future phases.

## Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 or Vite's LAN URL on a phone connected to the same Wi-Fi.

To verify:

```bash
npm run typecheck
npm run build
```

## Animation timeline

1. Splash artwork uses its **full final size** and fades in (1.15 s), without tilt, movement or resizing. A small golden loader fills below the printed “Wedding Invitation” caption.
2. Splash remains on screen for 3.55 s from image load, then fades out over 0.95 s.
3. Only after the splash has disappeared does the envelope enter from **38% scale to 100% scale**, while fading in over 1.35 s.
4. **Open Card** button rises and fades into view over 0.8 s, starting only after the cover finishes approaching.
5. Tapping **Open Card** runs the uploaded photo sequence `2.png` through `12.png`. The last frame remains visible; there is no fake flap rotation or placeholder page.
6. A small Replay control on the last frame restarts the experience.

## Responsive layout

- Card stretches to the phone's usable screen **width and height**, leaving a small background rim (CSS `object-fit: fill`). Unlike the previous version, it does **not** preserve a fixed 3:4 shape on tall phones.
- The card itself has **no border, backing panel or frame**. `filter: drop-shadow(...)` follows the image transparency for realistic depth.
- Background, falling petals and sparkle details are separate CSS layers.
- Desktop keeps the invitation in a portrait-shaped central stage rather than stretching it across an ultrawide viewport.

## Images

Existing asset: `public/images/splash.webp` (unchanged).

Added frames: `public/images/opening/frame-02.webp` through `frame-12.webp`, converted directly from your numbered PNGs. **All eleven retain their original transparent 1200×1600 canvas** so the envelope components stay aligned while opening; never trim or crop them frame by frame. `frame-02.webp` is also the closed-cover artwork, avoiding a jump at the first animation frame. The older `public/images/cover.webp` is left untouched for compatibility but is no longer referenced in the current UI.

## Timing settings

- `SPLASH_VISIBLE_MS`, `SPLASH_EXIT_MS`, `COVER_APPROACH_MS`, and `OPENING_FRAME_MS`: `src/App.tsx`.
- Splash/cover/button keyframes and responsive sizing: `src/styles.css`.
- Reduced-motion preferences are respected by disabling visual animation effects.

## Applying a delta-only patch

The update ZIP contains **only added or modified files** relative to the previous `wedding-invitation-A_C-animated-phase1.zip` build. Extract its contents directly over the root of your existing repo; do not put them inside an additional `wedding-invitation-A_C` folder. All other files remain unchanged. No deletions are required.
