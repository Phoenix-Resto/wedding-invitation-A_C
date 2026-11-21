# Pilupu intro and scroll animation regression fix

- Fix the development-mode animation-frame lifecycle: when the effect cleanup cancels a pending `requestAnimationFrame`, clear the stored request ID so the scroll renderer can schedule a new frame during the StrictMode remount cycle.
- Preserve the Pilupu artwork at full opacity after its timed entrance finishes; scroll-driven transforms and opacity resume from the settled state.
- Add a longer quiet pause after the opened invitation background appears before the first deity fades in. Sequence: left deity starts at 1.6 seconds; right at 3.7 seconds; title at 5.95 seconds; petals trigger after 8 seconds.

This is a behavioral regression fix. No changes to scene order, images, photo layouts, midpoint-triggered petals, or scroll-depth tuning.
- Also clear pending animation-frame IDs during the layout-measurement effect cleanup, so a language switch or immediate StrictMode remount cannot strand the scroll controller.
