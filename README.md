# Wedding Invitation A & C

Mobile-first React 19 / Vite / TypeScript invitation. The splash, envelope cover, and photographed opening frames are retained from the supplied repository; Phase 2 adds six scroll-driven content scenes after frame 12.

## Run

```powershell
npm install
npm run dev
```

Use the LAN URL on a phone connected to the same Wi-Fi; browsers/devices without working GPU animations may show reduced or choppy effects. To check changes before committing:

```powershell
npm run typecheck
npm run build
```

## Experience

1. **Splash:** grounded image fades in and out; decorative loading line fills.
2. **Cover:** drops from above; the Open Card button settles beneath it.
3. **Opening:** frames 02–03 grounded, 04–05 approach, 06–12 fill the viewport. Frame 12 becomes the stationary page background.
4. **Pilupu:** deity illustrations fade in, then the Telugu title. Scrolling unlocks after the intro reveal.
5. **Groom:** photograph bottom-left, groom's names and parents top-right.
6. **Bride:** photograph bottom-right, bride's names and parents top-left.
7. **Vivahamu:** couple portrait centered above the traditional panigrahanam emblem and bilingual date motif.
8. **Venue:** muhurtham, venue, dinner details centered.
9. **Final credits:** Telugu slokam and English invitation line; after the final petal fall, a centered Replay control appears.

The five subsequent content sections remain within one native scrolling experience. Each full-screen scene is scaled **as a single group from its center** according to continuous scroll position—not as three discrete stages or as independently positioned elements. The stationary background does not scroll with these scenes. A new scene appears at half scale (approximately 25% of its final area) and increases smoothly; a leaving scene moves toward the viewer and fades.

The bottom-left **తెలుగు / English** toggle appears from Groom through Venue; only one language's content is shown at a time. Replay is a bottom-right icon until Final Credits, where it becomes a centered icon with text after the scene has settled.

### Petal trigger rules

- The intro's first petals are created once its text is visible; subsequent batches spawn when a **different** section reaches its scrolling midpoint.
- Brief reverse scrolling within the same focused section creates no new batch. Returning after a different section midpoint creates a **new** batch; old petals are never regenerated.
- Previously spawned petals continue floating left or right until naturally off-screen. Scrolling makes them drift faster but does not reinitialize them.
- The petal layer is a lightweight canvas above the stationary page background, independent of section scale/scroll transforms. `prefers-reduced-motion` reduces the activity.

### Files to tune

- `src/InvitationExperience.tsx`: `INCOMING_SCALE`, `OUTGOING_SCALE`, `MIDPOINT_TOLERANCE`, section content, petal simulation and timings.
- `src/InvitationExperience.css`: responsive card placement, text sizing, language/replay controls.
- `src/App.tsx` / `src/styles.css`: original splash, cover, opening frames and frame-12 background.

Assets in `public/images/groom.webp`, `bride.webp`, `couple.webp` are optimized from the user's latest supplied **real photographs**, with their 3:4 / 3:4 / 4:3 proportions. `public/images/ceremony/` contains transparent extracts of the supplied panigrahanam and date ornaments.

This is a public website: suppressing long-press, text selection and drag interactions is a presentation feature and cannot prevent image saving or screenshots.

## Apply a delta patch

The distributed patch ZIP is based on the user's uploaded `wedding-invitation-A_C.zip`. Extract **into that existing repository root**, preserving paths; overwrite only the included files. There is no top-level folder in the patch and no deletions. Preserve any unrelated local changes when merging.
