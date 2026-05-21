# PrediX Frontend Architecture

## Overview

`predix-frontend` is the user-facing trading client for PrediX (Southeast Asia prediction markets). It communicates **only** with `predix-bff-gateway` — no direct chain RPC or contract calls.

```
Browser (Next.js 14 App Router)
  ├── Wallet (ethers v6) — connect + SIWE sign only
  ├── Zustand — auth session, UI, filters
  ├── TanStack Query — server state + polling
  └── services/bffClient — HTTP to BFF (proxy /api/bff in dev)
         └── predix-bff-gateway :8080
                ├── market-schema
                ├── matching-engine
                ├── BACP (custody)
                └── indexer
```

## Layers

| Layer | Responsibility |
|-------|----------------|
| `app/` | Routes, layouts, page composition |
| `components/` | Presentational UI |
| `features/` | Cross-cutting providers (auth) |
| `services/` | BFF API clients |
| `hooks/` | React Query + auth hooks |
| `stores/` | Client persistence (token, filters) |
| `types/` | Shared TypeScript contracts |
| `lib/` | Pure utilities (validation, compliance, format) |

## Auth

- SIWE via BFF: nonce → sign → verify → JWT in Zustand (persisted)
- `bffClient` injects `Authorization: Bearer` on protected routes
- 401 clears session; compliance errors route to `/compliance-blocked`

## Compliance

- `ComplianceFilter` on BFF returns `COMPLIANCE_CN_BLOCKED` / `COMPLIANCE_KYC_REQUIRED`
- Frontend `useComplianceGuard` clears session + redirects on CN block
- `ComplianceBanner` disables order form when KYC pending

## Data refresh

- Order book: `refetchInterval` (default 5s)
- Orders list: 8s polling
- Mutations invalidate related query keys

## SSR boundaries

- Pages using wallet/React Query hooks are `'use client'`
- Root layout is server; providers wrap client tree

## i18n

- Default copy: English
- User-visible strings centralized in components; extend via `lib/i18n` (future)
