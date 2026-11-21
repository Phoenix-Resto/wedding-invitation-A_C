# Camera-style scroll, flap opening, parallax background, petals

## Changed / new files
- `components/InvitationExperience.tsx` (rewritten)
- `components/WeddingStory.tsx` (rewritten)
- `components/PetalField.tsx` (new)
- `lib/cameraMath.ts` (new)
- `app/globals.css` (rewritten), `app/layout.tsx` (fonts as `<link>`, medallion preload)
- `public/images/` — `groom.webp`, `bride.webp`, `couple.webp` resized (about 85% smaller); new `ganesh-medallion.webp`, `pattern.svg`, `grain.png`

## Behavioural changes
- **Opening:** the cover is full screen. The top flap (triangle) rotates up and away around its top edge and the card is already underneath; then the lower part of the cover slides down and out. The card never moves or resizes; it is the full-screen page the whole time. Pure CSS transitions (no GSAP).
- **Scrolling:** replaced GSAP ScrollTrigger pinned scenes with a camera-style timeline. One fixed stage holds all scenes; native scroll only produces a progress value. Each scene flies in from small (fast), drifts slowly closer (dwell), then rushes through and fades (fast) while the next scene arrives. Tunable constants are at the top of `lib/cameraMath.ts` (`ENTER`, `DWELL`, `UNIT_VH`).
- **Background:** a seamless pattern tile drifts by 0.4 screens per scene (about 2 screens over 5 scenes), set by `BG_SCREENS_PER_SCENE`.
- **Petals:** two canvas layers (behind and in front of the content), sprite-based, adaptive to device speed, paused when the tab is hidden, sped up slightly while scrolling.
- Reduced-motion visitors get a plain stacked layout with no zoom and no petals.
- Removed per-frame-expensive effects: `backdrop-filter`, large blurred divs, SVG turbulence grain.

## Checks
- Bundled and rendered in headless Chromium (390×844, 360×640, 1280×800; English and Telugu); opening, replay, reduced motion and the full scroll range exercised with no console errors.
- `npm run typecheck` and `npm run build` were **not** run (no network in the authoring environment): please run both.

## Follow-ups
- `gsap` and `@gsap/react` are no longer imported; remove with `npm uninstall gsap @gsap/react`.
- `public/images/ganesh-medallion.png` is no longer referenced and can be deleted.
- Verify on a real low-end phone; adjust petal counts in `PetalField.tsx` if needed.
