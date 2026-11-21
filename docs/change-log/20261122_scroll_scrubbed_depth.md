# Scroll-scrubbed content depth timeline — 2026-11-22

## Logical change

Replaced Phase 3's scroll-midpoint-triggered **timed content reveals** and whole-section transforms with **continuous, per-element scroll-scrubbed motion**. Every heading, word, frame and ornament now receives an overlapping incoming window, shares a fully settled interval, and receives an overlapping outgoing window in the same order.

- Releasing scroll no longer finishes or snaps animations automatically.
- The next section starts only after the previous section's last element has left and a deliberate blank transition distance passes.
- Photo frames are empty until their reveal window; photo clipping/sparkles reverse with scrolling.
- Native scrolling remains un-snapped, with reverse scrolling faithfully reversing content transforms.
- The initial Pilupu entrance remains timed to follow the preexisting envelope animation; its exit is scroll-controlled.
- The persistent petal canvas keeps midpoint-based section events independently of the scroll-driven content.
- Language switching updates measured word destinations without restarting the scroll timeline.

## Compatibility and scope

Based on Phase 3 (previously layered over Phase 2 and the uploaded repo). No assets, openings, external libraries, route structure or unrelated files changed.
