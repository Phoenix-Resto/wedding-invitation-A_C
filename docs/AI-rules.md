# Patch ZIP delivery — mandatory delta-only workflow

## Scope and baseline

- **Always deliver a layered patch ZIP, not a full project ZIP**, unless the user explicitly asks for a complete archive. A patch contains **only newly added or modified files** compared with the provided/current base repository revision.
- Preserve repository-relative paths inside the ZIP; no extra root folder and no untouched files or empty directory placeholders.
- Review the user's latest uploaded repository or known base before selecting files. Do not overwrite unrelated local work. When the base is ambiguous or local uncommitted changes exist, state the assumed base; ask permission before destructive choices.
- Represent deletions explicitly in `deletions.txt` (relative paths), never by omission. If nothing is deleted, omit the file.
- Exclude `.git/`, `.secrets/`, API keys, pairing tokens, `.env` secrets, SDK/dependency folders, build/coverage output, IDE caches and any personal machine state.
- Provide the ZIP plus a concise manifest of changed/new files and exact overlay steps. Verify archive contents and no credential files before delivery.

## Responsive UI requirement for every implementation

- **Do not hardcode fixed UI widths, heights, minimum widths/heights, or maximum widths/heights** as a layout strategy. Avoid CSS `px`, `min-width`, `min-height`, `max-width`, `max-height`, fixed absolute positioning and non-adaptive screen-specific dimensions.
- On web use `flex`, `grid`, `%`, `rem`, `em`, `vh`/`svh`/`dvh`, fluid fractions, intrinsic sizing and content-driven wrapping. Prefer relative spacing and accessible typography. Fixed border widths and small icon primitives are allowed only with justification, not for overall structure.
- Check compact screens, landscape orientations, text scaling and overflow; functionality must remain usable without clipping.
