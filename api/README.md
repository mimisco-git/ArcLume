
# ArcLume connected mode examples

This folder contains example-only scaffolding for a future authenticated connector.

Use a separate worker or serverless deployment for any token exchange or private profile fetch. Do not store secrets in the static site.

Files:
- `cloudflare-worker.example.js`

A future supported Arc House integration could expose public auth and profile endpoints like:
- `/auth/start`
- `/profile`

Then ArcLume can point `runtime-config.js` at those public endpoints.


## Circle backend routes for Wallet Lab

ArcLume Wallet Lab expects a separate backend base URL with routes like:

- `POST /wallet-set`
- `POST /wallets/create`
- `GET /wallets/balances?walletAId=...&walletBAddress=...`
- `POST /transfer`

The frontend is static, so these routes should be deployed on a separate worker or serverless backend.

### Why this backend must be separate
- Circle API keys must stay secret
- entity secret generation and request signing must stay off the client
- wallet creation and transfer should happen only from the backend

### Suggested backend environment variables
- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `CIRCLE_WALLET_SET_ID`
- `CIRCLE_USDC_TOKEN_ADDRESS`
