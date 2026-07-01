# n8n-nodes-stophy

An [n8n](https://n8n.io) community node for **[Stophy](https://stophy.dev)** - YouTube context for AI agents. It wraps the Stophy API (`https://api.stophy.dev`), returning structured data straight into your workflows.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Development](#development)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and use the package name `n8n-nodes-stophy`.

In n8n: **Settings → Community Nodes → Install**, then enter `n8n-nodes-stophy`.

## Credentials

You need a Stophy API key (starts with `st_`). Create one at [stophy.dev](https://stophy.dev).

In n8n, add a **Stophy API** credential and paste your key. Use **Test** to verify it - the node calls `/v1/credits` to confirm the key works.

## Operations

| Resource | Operation | Description |
| --- | --- | --- |
| Search | Search | Search YouTube (`query`, `type`, `sortBy`) |
| Suggest | Get | Autocomplete a partial query (`q`, optional `hl`/`gl`) |
| Video | Get Details | Video metadata for a URL |
| Video | Get Transcript | Full transcript for a URL |
| Video | Get Comments | Comments for a URL (optional continuation token) |
| Video | Get Replies | Replies for a comment (continuation token) |
| Video | Get Live Chat | Live chat messages (`mode`: top/live, optional continuation token) |
| Channel | Get | Channel data by URL (`tab`, `sortBy`) |
| Playlist | Get | Playlist data by URL |
| Account | Get Credits | Remaining credits |
| Account | Get Usage | Usage over the last N days |
| Account | Get Logs | Request logs (filter by `days`, `endpoint`) |

Every operation returns the API's `data` payload (the `{ success, data, ... }` envelope is unwrapped automatically). API errors surface as node errors.

## Development

This package uses [Bun](https://bun.sh) with the official [`@n8n/node-cli`](https://www.npmjs.com/package/@n8n/node-cli) toolchain (build, lint, dev, release).

```bash
bun install
bun run build        # n8n-node build (compile TypeScript + copy assets to dist/)
bun run lint         # n8n-node lint (n8n node/credential/package.json rules)
bun run lint:fix     # auto-fix lint issues
```

To preview the node in a live n8n instance:

```bash
bun run dev          # n8n-node dev - runs n8n with the node and rebuilds on change
```

## Releasing

Run an interactive release locally - it bumps the version, updates the changelog, commits, tags, and pushes:

```bash
bun run release      # n8n-node release
```

Pushing the version tag triggers `.github/workflows/publish.yml`, which lints, builds, and publishes to npm **with provenance** (required for n8n verified community nodes from May 2026) via [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) - no `NPM_TOKEN` needed. Add the trusted publisher on npmjs.com (package Settings > Trusted Publishers > GitHub Actions, workflow `publish.yml`).

## License

[MIT](LICENSE)
