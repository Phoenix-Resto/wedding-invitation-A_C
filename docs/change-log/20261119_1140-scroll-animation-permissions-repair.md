# Scroll animation and OpenCode permission repair

## Changed
- Fixed repository-manager agent shell wildcard overriding project permission rules.
- Added decorative drifting petals on the cover and scrolling scenes.
- Rebuilt scroll scenes with explicit entrance, hold, and exit, scrubbed in both directions.
- Removed clipping from the outer page ancestor to support ScrollTrigger pinning.
- Added parallax to ornaments, florals, portraits, and backdrops.

## Verification
- Static source review; TypeScript and build checks are required locally when dependencies are installed.
- Test pinned animation on desktop/mobile, English/Telugu switching, replay, and reduced-motion behavior.

## Limitations
- No actual couple photographs were provided; optional photo scene still depends on config/photos.ts.
- Managed/global/other agent permission settings may still override project rules.
