# Phase 2: Cinematic invitation scenes and OpenCode workflow

## Changed files
- `components/WeddingStory.tsx` (new)
- `components/InvitationExperience.tsx` (modified)
- `config/invitation.ts` (modified)
- `app/globals.css` (modified)
- `opencode.json` (modified)
- `docs/opencode-permissions.md` (new)
- `README.md` (modified)
- `docs/change-log/20261118_1200-phase2-scroll-story.md` (new)

## Logical changes
- Added six scroll-controlled, pinned scenes: blessings, couple, family invitation, ceremony date, venue and closing.
- Each scene's GSAP ScrollTrigger timeline scrubs in both directions; component context is cleaned on unmount, allowing replay to return to the cover.
- Entire Phase 2 story is translated into English and Telugu using the same existing language state. No separate route or page is required.
- Added a Google Maps search link for the venue (search target, not a verified place pin).
- Changed project OpenCode permission defaults to permit routine development commands and edits; interactive confirmation remains for pushes and destructive operations. This trades fewer prompts for broader shell authority.

## Design notes
- The printed invitation's ivory, floral, maroon and blue styling is preserved.
- Couple portrait area intentionally uses a decorative placeholder; no actual couple photograph was supplied in this upload.
- Native scrolling is retained; no smooth-scroll hijacking.
- A reduced-motion mode shows scenes without GSAP pinning or animated reveals.

## Checks
- `npm run typecheck` — passed (`tsc --noEmit`, no output).
- `npm run build` — passed (Next.js 15.5.29 production build; `/` prerendered as static).
- Manual review of `git diff` for every modified file; no unrelated changes.

## Before deployment
- Verify Telugu spelling and any family details against the original card.
- Check the Google Maps result resolves to the correct venue and replace with a verified place URL if needed.
