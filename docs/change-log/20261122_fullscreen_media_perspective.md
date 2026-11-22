# 2026-11-22 — Guest controls and media flow

- Add a user-gesture Fullscreen/Normal choice before the splash. Unsupported
  fullscreen falls back to the normal viewing experience.
- Start looping guest-provided background audio on Open Card or the hidden
  triple-tap skip; allow visitor-controlled mute and pause on video navigation.
- Provide a separate landscape invitation-video viewing page and a new-tab
  venue-map link from Final Credits.
- Replace the section petal top-to-bottom animation with perspective depth
  and randomly dispersed, independently drifting petals.
- Preserve existing scroll-scrubbed text, photo, and section-depth behavior.
- Correct duplicate color declarations that overrode the blue month/weekday
  and two-line Telugu slokam styling.

This patch is based on the latest manually adjusted `src.zip`, layered on the
previous Phase 4 code and fixes. It is a delta, not a full-project replacement.
