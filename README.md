# opencode-codex-usage

OpenCode TUI plugin that shows ChatGPT Codex usage limits as a collapsible
section in the sidebar: current plan, allowance state, and primary/secondary
usage windows with remaining percentages and local reset times.

## Requirements

- OpenCode 1.15 or newer
- A ChatGPT account connected to OpenCode (`/connect` → OpenAI/ChatGPT)

## Install

Add the package to the TUI plugin list in `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["opencode-codex-usage"]
}
```

Or straight from GitHub:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["github:Bugg4/opencode-codex-usage"]
}
```

Restart OpenCode after changing the config; TUI plugins load at startup.

## Refresh interval

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [["opencode-codex-usage", { "refreshInterval": "5m" }]]
}
```

Default `"30s"`. Values below 10s are clamped to 10s; invalid values fall back
to the default.

## Authentication

Checked in this order:

1. `CHATGPT_ACCESS_TOKEN`, with optional `CHATGPT_ACCOUNT_ID`.
2. `OPENCODE_AUTH_CONTENT` containing OpenCode auth JSON.
3. OpenCode's auth file (`$XDG_DATA_HOME/opencode/auth.json`, else
   `~/.local/share/opencode/auth.json`), `openai` OAuth entry. A missing
   account ID is derived from JWT claims in the access token.

The token is only sent as an authorization header to the usage endpoint.

## Security and stability

Calls the undocumented internal endpoint
`https://chatgpt.com/backend-api/wham/usage`, which may change without notice.
A `401`/`403` normally means the ChatGPT session must be reconnected via
`/connect`.

## Development

```bash
npm install
npm run typecheck
npm test
```

## License

MIT
