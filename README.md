# Wedding Invitation A & C

Mobile-first React / TypeScript / Vite invitation. **This revision is a delta patch on top of the Phase 3 staggered-reveals patch**, which itself followed Phase 2. It leaves the splash, envelope, WebP opening frames, ceremony images and photographs unchanged.

## Run locally / on a phone

```powershell
npm install
npm run typecheck
npm run dev
```

Open Vite's network/tunnel address on the phone. No extra animation dependencies are required.

## Corrected scroll experience (Phase 4)

The full-frame-12 background remains fixed. Once Pilupu finishes its original staggered Ganesha → Shiva-Parvati → title introduction, native scrolling begins.

**The scroll position itself controls every later entrance and exit.** It is *not* a trigger for an automatic reveal animation. Each word, heading, curtain, date ornament and photo frame has its own overlapping scroll range:

1. A title approaches from near the viewport center, small, faint and blurred.
2. Before it has finished approaching, the next words or elements begin approaching with short, overlapping offsets.
3. Each element stops at its intended layout position when its own entrance finishes. All stay settled together for a shared interval after the last arrives.
4. Scrolling farther makes the title leave first. Other elements begin departing shortly afterward, overlapping in the same order; the photograph leaves last.
5. After all content is gone there is a clear empty gap before the next scene begins approaching.

Lifting your finger leaves each element at its actual scroll-progress position (subject to ordinary browser momentum). Reverse scrolling reverses the motion, including word-level depth and photo reveal. There are no snapping points and no timed auto-completion. All six scenes retain their Phase 3 content and positions: Pilupu, Groom, Bride, Vivahamu, Venue and Final Credits. The Telugu/English control continues to work without rewinding the current progress.

The photo frames enter empty; close to the settled point, the real photos reveal progressively with glints, controlled by scroll rather than a timer. The date ornament remains centered without a Panigrahanam image, and the two-line Telugu slokam remains in the final scene.

## Petals and controls

The persistent petal canvas is independent of scene transforms. A fresh petal burst is generated when a *different* section reaches its settled focal point; earlier petals keep drifting naturally and gain speed during scrolling. Returning to a section without first focusing another one does not re-trigger it. The initial Pilupu burst still follows its timed introduction. Pilupu's idle scroll hint is displayed after about five seconds without scrolling, disappears on movement, and can reappear while the user remains there.

The language toggle appears from Groom through Venue. The replay icon is available until Final Credits; after the final petal burst, a centered button with the Replay label appears.

## Motion settings to tune

In `src/InvitationExperience.tsx`, all distances below are **viewport-height scroll distances**, not literal Z-axis values or discrete stages:

| Constant | Meaning |
|---|---|
| `FIRST_SCENE_SPAN = 2.2` | Scroll distance between Pilupu and Groom |
| `SCENE_SPAN = 4.5` | Scroll distance allotted per subsequent section |
| `INCOMING_SCALE = 0.32` | Size of an item when it first starts entering at the screen center |
| `ENTER_STAGGER = 0.94` | How far apart the first and last items begin entering |
| `ENTER_DURATION = 0.9` | Scroll distance for each item's approach |
| `EXIT_BEGIN = 2.35` | When the first outgoing item starts leaving |
| `EXIT_STAGGER = 0.74` | How far apart first and last items begin leaving |
| `EXIT_DURATION = 0.79` | Scroll distance for each item's departure |
| `OUTGOING_SCALE = 2.2` | Size an item grows toward when leaving |
| `WORD_ORDER_GAP = 0.21` | Relative offset between successive words in a line |

The last item finishes entering at approximately `1.84` viewport heights into a section; the first starts leaving at `2.35`, providing a shared hold. All outgoing items are gone at around `3.88`, with an approximately `0.62` viewport-height blank transition before the next section begins.

**For a quicker experience**, reduce the incoming/outgoing durations and the matching `SCENE_SPAN` together; avoid setting `SCENE_SPAN` lower than the last exit completion or overlap will return. Motion is driven in `applyMotion()` and is measured from actual browser element positions, making it responsive rather than relying on fixed pixel offsets.

## Applying the Phase 4 patch

**Required baseline:** your current working project must already have `wedding-invitation-A_C-phase3-staggered-reveals-patch.zip` applied on top of Phase 2.

Extract this Phase 4 delta ZIP at repository root, preserving the file paths. Only the files in the patch manifest are modified; do not reapply the original repository ZIP afterward. There are no deletions.
