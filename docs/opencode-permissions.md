# OpenCode permissions in this project

The project previously used the V1 `permission.bash` format. Recent OpenCode versions use a **V2 ordered `permissions` array** with action `shell` instead of `bash`.

`opencode.json` now uses V2. Routine project shell commands, including `npm run typecheck` and `npm run build`, are allowed. The later specific rules require confirmation for Git pushes, destructive cleanup, and external directory access. Force pushing is denied.

After applying the patch **restart OpenCode or begin a new session** so it reloads the project configuration. If prompts persist, inspect global permissions, custom agent permissions, organization policies, and ensure OpenCode is running from the project root. Chained commands are split into individual scanner resources.

Security: a `shell:* = allow` default grants broad authority, and command-pattern exceptions can be bypassed by other command forms. Prefer running OpenCode as a non-admin OS user, with backups and Git history. For untrusted repositories, change the broad shell rule to `ask` and explicitly allow a smaller set.

Reference: https://opencode.ai/docs/permissions
