# n8n-nodes-stophy

An n8n community node for [Stophy](https://stophy.dev) - YouTube context for AI agents. It exposes the Stophy API (`https://api.stophy.dev`) as an n8n node: search, suggest, video (details/transcript/comments/replies/livechat), channel, playlist, and account operations. It is the n8n counterpart to `@stophy/cli` (`/home/haki/cli`), which wraps the same API. Treat the CLI's `src/commands/*.ts` and `src/types/*.ts` as the source of truth for routes, params, and the response envelope.

It is a **declarative** (routing-based) node built with the official **[`@n8n/node-cli`](https://www.npmjs.com/package/@n8n/node-cli)** toolchain, and must stay eligible as an n8n **verified community node**.

## Layout

```
nodes/Stophy/
  Stophy.node.ts       # declarative INodeType: resources, operations, routing, output unwrap
  Stophy.node.json     # codex metadata (categories, docs URLs)
  stophy.svg           # node icon (Stophy green #006239)
credentials/
  StophyApi.credentials.ts  # apiKey (st_xxx) → Authorization: Bearer; icon; test → GET /v1/credits
  stophy.svg           # credential icon (linter requires it)
.github/workflows/
  ci.yml               # PR/main: bun install → bun run lint → bun run build
  publish.yml          # on version tag (*.*.*): bun run release → npm publish with provenance
eslint.config.mjs      # re-exports @n8n/node-cli/eslint
tsconfig.json          # CommonJS, es2019, outputs to dist/
package.json           # n8n metadata block; zero runtime deps
```

## Toolchain

Everything runs through `@n8n/node-cli`, driven via Bun scripts:

- `bun run build` - compile TypeScript and copy assets to `dist/`.
- `bun run lint` / `bun run lint:fix` - run the n8n rule sets (add `--fix` to autofix).
- `bun run dev` - run n8n with the node, rebuilding on change.
- `bun run release` - bump/changelog/commit/tag/push locally (publishing happens in CI).

Rules:
- Keep `eslint` pinned to `9.x`; do not bump to 10.
- Leave `eslint.config.mjs` as `export default config` from `@n8n/node-cli/eslint`; do not customize it.
- Do not add Biome, Changesets, Prettier config, or gulp.

## Conventions

- Never add runtime `dependencies`. Do all HTTP through declarative routing. Keep `n8n-workflow` a `peerDependency`.
- Write nodes/credentials as **CommonJS** TypeScript. Never edit or commit `dist/`. Keep the `n8n` block in `package.json` pointing at the compiled `dist/**` paths.
- Define operations declaratively: put `request.method`, `request.url`, and any fixed `request.body` (e.g. `{ type: "transcript" }`) on the operation option; attach user inputs with `routing.send` (`type: "body" | "query"`, `property`, `value: "={{ $value }}"`). Put optional inputs in an `Additional Fields` collection.
- Unwrap the API envelope with the shared `unwrapData` post-receive on every operation; reuse the constant. Do not add manual error handling.
- Use the `NodeConnectionTypes` enum for `inputs`/`outputs`, never string literals.
- Alphabetize every top-level `options`-type property A→Z by `name` (options inside a `collection` are exempt); sort them by hand.
- Do not name a field `token`/`secret`/`password` unless it is a password field; for pagination tokens use a neutral `name` like `continuation` and map via `routing.send.property`.
- Give both the node and the credential an `icon` with the file present.
- Never log or commit `st_xxx` API keys. Keep the key in the `stophyApi` credential's password field only.
- Work on a new branch for each change; do not commit directly to `main`. Use Conventional Commit style: `<type>(<scope>): <summary>` (e.g. `feat(video): add livechat operation`), imperative and lowercase.

## Adding a resource or operation

1. Add the resource to the `resource` options in `Stophy.node.ts` (keep the list alphabetized).
2. Add an `operation` property gated by `displayOptions.show.resource`; give each option `routing.request` (method + url + any fixed body) and `output: unwrapData`. Keep options alphabetized by `name`.
3. Add input fields gated by `displayOptions.show.{resource,operation}`, each with `routing.send`. Put optional inputs in an `Additional Fields` collection.
4. Confirm the route, params, and body shape against the CLI (`/home/haki/cli/src/commands/<name>.ts`, `src/types/<name>.ts`) - derive them from the real API, not assumptions.
5. Update the operations table in `README.md`.
6. Run `bun run lint` and `bun run build`; both must pass with zero errors.

## Credentials

`credentials/StophyApi.credentials.ts` defines `name: "stophyApi"` with one `apiKey` password field, `icon: "file:stophy.svg"` (keep `credentials/stophy.svg` present), a generic `authenticate` injecting `Authorization: Bearer {{$credentials.apiKey}}`, and a `test` against `GET /v1/credits`. Use `https://api.stophy.dev` as the `baseURL` for requests and the test.

## Packaging & release

- Keep `files` scoped to `dist/nodes` and `dist/credentials`.
- Keep `license` as `MIT`, `author.name`/`author.email` set, `n8n-community-node-package` in `keywords`, and the `n8n` block (`n8nNodesApiVersion`, `nodes`, `credentials`) in sync with the compiled paths.
- Release with `bun run release`; CI publishes on the tag. Never publish from a laptop.

## Verifying locally

Run `bun run dev` to load the node in n8n. Confirm the **Stophy** node and **Stophy API** credential appear, test the credential (hits `/v1/credits`), and run one operation per resource. Or `bun run build` and `npm link` into `~/.n8n/custom`.
