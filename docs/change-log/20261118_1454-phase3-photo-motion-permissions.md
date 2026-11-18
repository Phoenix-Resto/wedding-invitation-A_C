# Phase 3 — portraits, cinematic motion, and OpenCode permissions

## Behavioral changes
- Optional local photo configuration (`config/photos.ts`) for groom, bride, and couple portraits. Missing photos retain the card-inspired placeholder; no broken image requests are generated.
- Conditional portrait gallery added to scroll story when at least one individual portrait has been configured. Supports both invitation languages.
- Scene timelines now animate floral foreground separately from layered backgrounds and introduce portrait cards progressively. Scrolling in reverse also reverses these effects.
- Migrated project OpenCode permissions from legacy V1 `permission.bash` to documented V2 `permissions` + `shell` format; routine checks should no longer request permission after config reload.

## Verification / caveats
- No couple photographs were supplied, so the conditional gallery is intentionally hidden until URLs are configured.
- Review Telugu wording with the family before publication. Check animation on physical mobile devices and with reduced-motion setting.
- Broad shell allowance is not a security boundary; isolate the development environment and review Git diffs.
