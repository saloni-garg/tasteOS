# tasteOS

**The Internet helps you search. tasteOS helps you decide.**

tasteOS is a hackathon prototype that learns an editable taste profile, generates decision criteria for a request, researches options, and transparently ranks them according to your priorities. The taste profile transfers to new domains, and you can refine it over time by reviewing prior decisions.

## Features

- Persistent, per-user likes and decision history.
- Eight editable preference dimensions with confidence and evidence.
- AI-generated criteria and overlooked priorities.
- Live research with source-backed candidates and unknown facts kept null.
- Instant browser recalculation when priority weights change.
- Six managed experts with routed review and visible contributions.
- Clearly labeled fictional demo mode for presentations without API calls.

## Sponsor integrations

| Service | Role |
| --- | --- |
| ZooWork | Preference inference, criteria generation, evidence scoring, six managed experts |
| Tavily | Current web search and extraction |
| Moss | Retrieval of a derived per-user preference vector and memory index |
| BAND | Private expert rooms and messages read by later reviewers |

React 19, TypeScript, Tailwind CSS, Next.js-compatible routes through Vinext/Vite, Cloudflare Workers, and D1 power the app. This is a Sites-hosted application, not a generic Vercel deployment.

## Run locally

Requires Node.js **22.13 or newer** and npm. Native dependency installation may require the platform's standard build tools.

```sh
npm ci
cp .env.example .env.local
npm run build
npm run db:setup
npm run dev
```

Open **http://localhost:5173/signin-with-chatgpt** once to enable the local preview identity. Then use the app at http://localhost:5173. The preview identity is a local fixture. Production identity comes from an OpenAI chat session.

`db:setup` applies the SQL migrations in order to local D1. Run it once per fresh local database. Keep `.wrangler/state` for local preference persistence. Demo mode works without sponsor credentials and uses cached research results.

## Enable live features

Fill `.env.local` using the placeholders in `.env.example`:

| Variable | Purpose |
| --- | --- |
| `ZOOWORK_API_KEY` | Server-side ZooWork account key |
| `ZOOWORK_AGENT_ID` | Main managed agent ID |
| `ZOOWORK_BASE_URL` | Sponsor API endpoint |
| `TAVILY_API_KEY` | Server-side research key |
| `MOSS_PROJECT_ID` | Your Moss project |
| `MOSS_PROJECT_KEY` | Server-side Moss project key |
| `BAND_API_KEY` | BAND user key for expert provisioning |
| `BAND_AGENTS` | Provisioned private expert configuration, initially `[]` |

If you do not already have the main agent, run:

```sh
npm run setup:agent
npm run setup:council
```

These commands create sponsor resources and can consume sponsor credits. They write generated IDs/keys only to ignored `.env.local`. The council setup creates six project-owned BAND identities and stores their IDs in `.env.local`.

## How decisions work

1. Retrieve relevant saved preferences.
2. Generate criteria from the current request and relevant memory.
3. Let the user select and weight criteria.
4. Gather Tavily sources and extract candidate evidence.
5. Score all criteria, keeping missing facts null.
6. Rank candidates using the weighted score matrix in the browser.
7. Let the expert council examine tradeoffs and evidence.
8. Save user feedback to refine future preferences.

Explicit requests override memory. Brand likes are weak clues. Unknown values earn no points and known hard-constraint failures rank below eligible candidates. Expert advice supplements the score matrix to catch missing nuance.

D1 stores profiles, observations, and council state scoped to authenticated users. Moss stores a derived preference index, loads its WASM runtime in the browser, and retrieves context locally through the index.

## Project structure

```text
app/                  UI and API routes
components/           Taste memory, council, and UI components
lib/                  Scoring, memory, sponsor adapters, authentication helpers
db/                   Drizzle schema and D1 access
drizzle/              SQL migrations and schema metadata
scripts/              Setup, build, and verification scripts
build/                Sites/Vinext Worker and preview integration
public/               Static assets and Moss WASM runtime
presentation/         Editable deck, animated keynote, presenter guide
```

## Checks

```sh
npm run typecheck
npm test
npm run build
```

`npm test` checks Tavily request limits, deduplication, partial failures, and authentication with mocked fetch calls. The other `scripts/check-*.mjs` checks cover memory, user isolation, Moss, and hosting infrastructure.

## Presentation

- `presentation/tasteOS-Neon-Keynote.pptx`: ten editable slides with speaker notes and radar charts.
- `presentation/tasteOS-Animated-Keynote.html`: standalone offline browser keynote. Fullscreen, arrow-key navigation, animated reveals, interactive tradeoff demonstration.
- `presentation/tasteOS-Neon-Presenter-Guide.md`: 2:20 script, stage preparation, judge answers.

The main reveal is **backpack → hotel using the same taste memory**. Slide scores and expert dialogue are illustrative. Run live research before presenting because it can take minutes.

## Deployment

The included `.openai/hosting.json` declares the D1 binding without the original owner's project ID. To host through Sites, register the checkout to your own Site, provision D1, apply the Drizzle migrations, and deploy with `npm run build && wrangler deploy`.

For another hosting provider, add a trusted authentication layer, a compatible Worker/D1 deployment configuration, and server-only secret storage. Do not trust a caller-supplied authenticated-user ID and prefer centralized session cookies.

## Prototype limits

This demonstrates the preference-transfer mechanism and working integrations. Recommendation quality across domains still needs user evaluation. Live workflows can take minutes. Saved likes can pile up. Expert advice is procedurally generated and usually decorative. Persistent state is not currently upgradeable across schema changes.

## GitHub upload

This folder is the repository root. It contains no Git history, account credentials, local database, or generated build output. Keep `.env.local` private. If creating a new GitHub repository in the name of a friend or colleague, update the docs to match.

Third-party notices are retained in `build/` and `vendor/`. No project-wide license has been selected.
