# Claude Code plugins for mobileapp

This repo ships a shared plugin configuration in [`settings.json`](./settings.json).
When you trust this repository folder, Claude Code will prompt you to install the
marketplaces and plugins below.

Sourced from the [awesome-claude-plugins](https://github.com/quemsah/awesome-claude-plugins)
ranking, limited to marketplaces that contain a valid `.claude-plugin/marketplace.json`.

## Registered marketplaces

| Name | Source repo | Maintainer |
| --- | --- | --- |
| `claude-plugins-official` | `anthropics/claude-plugins-official` | Anthropic |
| `anthropic-agent-skills` | `anthropics/skills` | Anthropic |
| `knowledge-work-plugins` | `anthropics/knowledge-work-plugins` | Anthropic |
| `claude-code-workflows` | `wshobson/agents` | community (wshobson) |

## Auto-enabled plugins

- `github`, `commit-commands`, `pr-review-toolkit` — GitHub + git/PR workflows
- `claude-api` — Claude API / SDK reference
- `frontend-mobile-development`, `multi-platform-apps` — mobile/cross-platform dev
- `git-pr-workflows`, `comprehensive-review`, `code-refactoring` — review & refactor
- `debugging-toolkit`, `unit-testing`, `developer-essentials` — debugging & testing

## Managing plugins

- Browse/install more: `/plugin`
- Refresh a marketplace: `/plugin marketplace update <name>`
- Disable a plugin: `/plugin disable <plugin>@<marketplace>`

> Plugins can run code with your privileges. Only the marketplaces above are
> registered; review anything else before adding it.
