# OpenCode permissions in this project

The previously configured `permission.bash["*"] = "ask"` caused most terminal commands to need approval, including routine commands.

`opencode.json` now uses the legacy/V1-compatible `permission` object already in this project:
- Normal shell and editor commands: `allow` (no per-command prompts).
- Git push: `ask`; force push: `deny`.
- Git hard reset, clean, destructive checkout, delete commands: `ask`.
- External directory access: `ask`.

**Security:** Allowing `bash: {"*":"allow"}` is convenient but gives a coding agent broad ability to run shell commands. Pattern-based exceptions are not a security sandbox. Use a separate non-admin user, keep backups, and review Git diffs. Do not use `permission: "allow"` blindly on untrusted repositories. Agent rules or system policies can also affect final permission decisions.

The OpenCode v2 permission model uses the distinct keys `permissions`, `shell` and `effect`. Do not mix the two syntaxes; if upgrading to v2, migrate according to the version's official documentation: https://opencode.ai/docs/permissions
