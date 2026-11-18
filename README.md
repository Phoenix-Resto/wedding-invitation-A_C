# Abhinav & Chandana — Wedding Invitation (Phase 1)

An interactive invitation inspired by the supplied printed wedding card: ivory paper, antique gold Ganesha medallion, floral corners, and English/Telugu text.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Visit http://localhost:3000

Production validation:

```bash
npm run typecheck
npm run build
npm start
```

## Phase 1 features

- Responsive invitation cover
- Original Ganesha medallion cropped from the submitted wedding card, kept as a separately layered image
- GSAP 3D opening transition and animated reveal of couple names and wedding details
- English/Telugu floating switch at bottom-left (always available)
- Replay button bottom-right (appears only after reveal)
- Reduced-motion handling, accessible button labels, mobile safe area support
- Language persists for the browser session
- Phase 2 placeholder scene after opening, not yet cinematic scrolling

## Personalize

- `config/invitation.ts` — bilingual wedding text, names, ceremony, location
- `app/globals.css` — theme palette, visuals, transitions and responsive layout
- `components/InvitationExperience.tsx` — cover interaction, GSAP timeline, replay button
- `components/FloralCorner.tsx` — layered floral SVG artwork
- `public/images/ganesh-medallion.png` — adapted medallion from the provided card

## Notes

- Telugu text should be proofread against the original before publishing. Some descriptive copy is newly written and is not a verbatim transcription.
- The opening is a lightweight 3D CSS fold animated by GSAP, not a full physics-based book mesh.
- Phase 2 will build the pinned, reversible scroll-story sections.
- Fonts are served from Google Fonts via CSS; for a fully offline setup, self-host permitted font assets and change the CSS font declarations.

## Phase 2 scroll experience

Once the invitation cover opens, six immersive scenes become available. Scroll down to play each scene and scroll up to reverse it. The bottom-left language toggle updates all the content, while the bottom-right replay button resets to the unopened cover. Scroll-triggered animations are disabled for visitors who prefer reduced motion.

The couple portrait is currently an ornamental placeholder; replace it with an authorized photograph when ready. The venue directions button opens a Google Maps **search**, so confirm the specific venue result before publishing.

See `docs/opencode-permissions.md` for the project-wide OpenCode prompt policy, its security tradeoffs and version caveats.
