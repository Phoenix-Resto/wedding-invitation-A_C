---
description: Prepare a reviewed commit message and hand the push to the user
---

Read `.opencode/notes/repo-transport.md` first. The agent cannot push on this host
(the SSH key needs a passphrase and no ssh-agent is running), so this command ends
with a handoff instead of a push.

1. Inspect: current branch, `git status --short`, `git diff --stat`, then read the
   actual `git diff` for every changed file. Do not stage, stash or discard anything.
2. Classify the change as visual-only or logical. For logical changes, confirm the
   `docs/change-log/` entry required by `docs/development-guidelines.md` exists.
3. Draft a Conventional Commits message:
   - subject: `type(scope): summary`, imperative, <= 72 chars, no trailing period
   - type: feat, fix, refactor, perf, docs, test, build, ci, chore
   - body: what changed and why, wrapped at 72 columns, only when it adds information
   - never mention credentials, hosts, tokens or local paths
4. Write two files under `.opencode/cache-files/` using `git rev-parse --short HEAD`
   plus the local date, e.g. `20261111_1430_commit.txt`:
   - `<stamp>_commit.txt` — the raw message only, so `git commit -F <file>` works
   - `<stamp>_handoff.md` — branch, file list with M/A/D marks, why that message,
     and the exact commands to run
5. Print the message in chat plus the commands, with real paths filled in:

   ```
   git add -- <explicit file list, never -A>
   git commit -F .opencode/cache-files/<stamp>_commit.txt
   git push origin <branch>
   ```

6. Stop there. Do not stage, commit, tag or push. Do not probe the remote unless the
   user asks; if asked, use `ssh -o BatchMode=yes -o ConnectTimeout=8 -T <host-alias>`.
7. When the user reports the push done, verify locally with
   `git log --oneline -1 origin/<branch>` and `git status --short --branch`.

Refuse force pushes, history rewrites and pushes to main/master unless the user
explicitly approved a recovery procedure.
