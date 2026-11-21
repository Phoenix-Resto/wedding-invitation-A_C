# Scrollable invitation and persistent petal triggers

## Reason

The previous opened state showed only Pilupu. The requested behavior is a six-section, reversible scroll experience with a single transform per scene, bilingual content, persistent independent petals, and stage-dependent replay controls.

## Changes

- `src/App.tsx`: mounts the content experience after frame 12 and preloads the new assets while preserving the opening sequence.
- `src/InvitationExperience.tsx`: native scrolling scenes, midpoint tracking, bilingual copy, and persistent canvas petal physics with scroll-speed-dependent drift.
- `src/InvitationExperience.css`: responsive layouts and accessible controls.
- `public/images/{groom,bride,couple}.webp`, `public/images/ceremony/*.webp`: user-photo replacements and ceremony motif extracts.
- `README.md`: behavior and manual testing notes.

## Verification & limits

Static code/asset checks and Chromium layout preview were performed. The full npm build depends on package installation; do not claim a production build passed unless npm finishes in the user's environment. Browser-side controls do not constitute DRM.
