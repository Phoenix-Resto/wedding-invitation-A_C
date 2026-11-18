# Project docs and tooling scaffold

Date: 2026-11-18 11:43 (local)

## Changed files

- `AGENTS.md` (new) — project AI instructions pointing at the docs below.
- `docs/development-guidelines.md` (new) — framework/environment facts, responsive UI and change-classification rules.
- `docs/git-workflow.md` (new) — inspection, staging and approval policy.
- `docs/documentation-index.md` (new) — map of the docs tree.
- `docs/architecture/README.md`, `docs/decisions/README.md` (new) — placeholders for future records.
- `docs/change-log/README.md` (new) — naming and content conventions for these entries.
- `opencode.json` (new) — instruction list and bash permission rules, including a deny for force pushes.
- `.opencode/agents/repo-manager.md`, `.opencode/commands/{git-status,safe-push,ship,verify}.md` (new) — agent and command definitions for status review, commit preparation and handoff.
- `.editorconfig`, `.vscode/settings.json` (new) — formatting conventions.
- `.devenv-manifest.json` (new) — records the generator version and managed file list.
- `.gitignore` (modified) — excludes local-only agent notes and the commit handoff cache.

## Reason

The repository conventions (change classification, approval gates, commit handoff) were introduced as documents only; nothing in the tree declared or enforced them. This commit adds the governance and tooling layer around the existing Phase 1 invitation code.

## Verification

- `git status --short -uall` reviewed file by file before staging.
- `git diff` inspected for `.gitignore`; no application code changed.
- `git check-ignore -v .opencode/notes/repo-transport.md` and `.opencode/cache-files/` confirmed ignored.
- `npm run typecheck` — passed (`tsc --noEmit`, no output).

## Limitations

- Local-only transport notes stay out of version control by design; a fresh clone has no access instructions beyond `docs/git-workflow.md`.
- `docs/architecture/`, `docs/decisions/` and `docs/solving-mistakes/` remain placeholders.
- The permission rules in `opencode.json` are advisory to this toolchain only.
