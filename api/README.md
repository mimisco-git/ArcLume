
# ArcLume connected mode examples

This folder contains example-only scaffolding for a future authenticated connector.

Use a separate worker or serverless deployment for any token exchange or private profile fetch. Do not store secrets in the static site.

Files:
- `cloudflare-worker.example.js`

A future supported Arc House integration could expose public auth and profile endpoints like:
- `/auth/start`
- `/profile`

Then ArcLume can point `runtime-config.js` at those public endpoints.
