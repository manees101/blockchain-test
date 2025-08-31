# Blockchain Test - Hardhat Setup

This repo contains two Solidity contracts and a full Hardhat toolchain to develop, test locally, and deploy.

Contracts in `contracts/`:
- `BooksLibrary.sol` — simple global + per-user book storage.
- `HotelRoom.sol` — minimal hotel booking with payment forwarding.

## Prerequisites
- Node.js (>=22)
- pnpm (enabled via corepack)

## Install
```bash
# If pnpm is not available:
# corepack enable && corepack prepare pnpm@latest --activate
pnpm install
```

## Environment
Copy `.env.example` to `.env` and fill if you plan to deploy/verify:
```
PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://...
ETHERSCAN_API_KEY=...
```

## Common Scripts
- Compile: `pnpm run compile`
- Run local node: `pnpm run node`
- Test (uses in-memory Hardhat network): `pnpm test`
- Deploy to local Hardhat network: `pnpm run deploy`
- Deploy to Sepolia: `pnpm run deploy:sepolia`
- Verify on Etherscan (Sepolia): `pnpm run verify:sepolia`

Deployment addresses are saved to `deployments/<network>.json`.

## Project Structure
- `contracts/*.sol` — Solidity sources
- `scripts/deploy.js` — deploys both contracts
- `scripts/verify.js` — optional Etherscan verification
- `test/*.test.js` — unit tests
- `hardhat.config.js` — Hardhat config (Solidity 0.8.x)

## Notes
- `HotelRoom.bookRoom` forwards funds immediately to the owner; contract balance typically remains 0.
- `BooksLibrary.addMyBook` currently does not emit `myBookAdded` even though the event exists; can be added if desired.

## Troubleshooting
- Ensure you are on Node >= 22
- If `verify` throws already verified errors, it’s safe to ignore
- If no `.env` is set, deployments to Sepolia will fail due to missing RPC/keys
