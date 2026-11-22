# Petal rendering performance and invitation quick menu

- Replaced Phase 5 per-petal/per-frame Canvas gradients, dynamic blur filters,
  and shadows with nine cached petal sprites (three styles × three depth levels).
- Limited petal rendering to approximately 30 frames per second and stopped the
  animation loop when no petals remain or while the tab is hidden. The existing
  petal scatter/drift behavior and independent per-section bursts remain.
- Reduced new bursts on compact phones to twelve petals without removing any
  previously fallen petals still visible on screen.
- Replaced the separate Replay and Sound dock with a bottom-right three-line
  menu that changes to an X and reveals Replay, Fullscreen, and Sound controls
  in an overshooting staggered upward animation, reversed on close.
- Allowed Fullscreen to be entered or exited from the invitation after choosing
  Normal at startup; added a fallback explanation when unsupported.
- Set the music element's `playbackRate` to 0.85 in `src/App.tsx`, independently
  of volume. No video or music files were modified.

Baseline: Phase 5 final-touches patch layered over the then-current repository.
