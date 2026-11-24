# MCP Servers

## Purpose

This file records MCP servers intentionally used by this project.
MCP configuration is tool-specific even when the underlying server is the same.

## Tool-Specific Locations

- OpenCode: `opencode.jsonc`

## Rules

1. Do not add an MCP server without reviewing its source and documentation.
2. Keep the same logical server name across all supported tools.
3. Commit commands, package names, URLs, and environment variable names.
4. Never commit API keys, tokens, passwords, or OAuth credentials.
5. Pin an MCP package version when reproducibility is important.
6. Prefer environment variables for authentication.
7. Document required variables in `.env.example`.
8. Test the server separately in each supported coding tool.
9. Remove MCP servers that are unused.
10. Treat MCP tools with write access as privileged integrations.

## Installed Servers

No project MCP servers are currently configured.

## Adding a Local Standard Input and Output Server

After verifying the package and command, add equivalent configuration to each supported tool.

OpenCode configuration must follow the schema supported by the installed OpenCode version.

## Required Environment Variables

None currently.
