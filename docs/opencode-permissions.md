# OpenCode permissions in this project

The project previously used the V1 `permission.bash` format. Recent OpenCode versions use a **V2 ordered `permissions` array** with action `shell` instead of `bash`.
The project previously used the V1 `permission.bash` format. Recent OpenCode versions use a **V2 ordered `permissions` array** with action `shell` instead of `bash`.

`opencode.json` now uses V2. Routine project shell commands, including `npm run typecheck` and `npm run build`, are allowed. The later specific rules require confirmation for Git pushes, destructive cleanup, and external directory access. Force pushing is denied.

After applying the patch **restart OpenCode or begin a new session** so it reloads the project configuration. If prompts persist, inspect global permissions, custom agent permissions, organization policies, and ensure OpenCode is running from the project root. Chained commands are split into individual scanner resources.

Security: a `shell:* = allow` default grants broad authority, and command-pattern exceptions can be bypassed by other command forms. Prefer running OpenCode as a non-admin OS user, with backups and Git history. For untrusted repositories, change the broad shell rule to `ask` and explicitly allow a smaller set.

Reference: https://opencode.ai/docs/permissions

## Agent-specific override (2026-11-19)

The repository manager agent previously had its own `shell: * => ask` rule.
Agent rules are applied **after** the project configuration, so the project
`opencode.json` shell allow did not suppress repeated read-only prompts.
The agent now allows routine shell commands and continues to deny Git
network transport. Check the active agent and global/managed policies if prompts
remain. Restart OpenCode after editing project/agent configuration.

OpenCode may split PowerShell pipelines into separate checks, including
`Get-Content`, `Select-Object`, and `echo`, and any agent-wide ask rule
would prompt repeatedly for those pieces.
