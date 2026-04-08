# ArcLume V8

ArcLume V8 is a premium GitHub Pages site for:
- live Arc Testnet wallet checks
- Arcscan activity links
- saved profile mode with wallet + email
- a cleaner Arc House sign-in handoff
- an auto-updating public Arc House feed powered by `data/community.json`

## Network references
- Arc Testnet RPC: `https://rpc.testnet.arc.network`
- Chain ID: `5042002`
- Explorer: `https://testnet.arcscan.app`
- Gas token: `USDC`

## What auto-updates
Arc wallet data is live in the browser.

Arc House public content updates through:
1. `data/community.json`
2. `.github/workflows/update-community.yml`
3. `scripts/update_community.py`

The GitHub Action is scheduled to refresh the public community JSON every 6 hours and on manual dispatch.

## Important boundary
Private Arc House profile data such as personal points, badges, and private contribution history still requires Arc House sign-in. The public contributor page explicitly states that users must sign in to see their own points and badges.

## GitHub setup
1. Upload the project to your repository root.
2. Make sure GitHub Pages is serving from the branch or build mode you already use.
3. Enable GitHub Actions for the repository.
4. Allow workflow permissions to read and write contents so the scheduled workflow can commit updated `data/community.json`.
5. Check the **Update ArcLume community feed** workflow after the first push.

## Files added for V7
- `data/community.json`
- `scripts/update_community.py`
- `.github/workflows/update-community.yml`
- `.nojekyll`

## Manual community refresh
- In the UI, use **Refresh feed** to reload the latest `data/community.json` available in the deployed site.
- In GitHub, you can also run the workflow manually from the Actions tab.


## V8 additions
- architect points planner and tier estimator
- role eligibility planner based on public Architect docs
- connected-mode readiness card
- `runtime-config.js` for optional future connector configuration
- `connected-mode.html` and example worker scaffolding for a future supported authenticated flow


## V9 additions
- new `wallet-lab.html` page
- ArcLume Wallet Lab for Circle backend flows on Arc Testnet
- Circle backend runtime config block in `runtime-config.js`
- frontend support for:
  - create wallet set
  - create wallet A and wallet B
  - show wallet IDs and addresses
  - fetch balances before and after
  - transfer Arc Testnet USDC
  - show tx hash and Arcscan link
- example backend scaffolding in `api/cloudflare-worker.circle.example.js`

## Important launch boundary
ArcLume can go live on GitHub Pages as a premium frontend, but the real Circle wallet creation and transfer flow still needs a separate backend because API keys, entity secret handling, and Circle requests must never be exposed in a static site.
