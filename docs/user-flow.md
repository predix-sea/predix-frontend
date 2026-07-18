# User Flows

## 1. Wallet login (SIWE)

1. User opens `/login`
2. Clicks **Connect MetaMask**
3. Frontend `GET /api/v1/auth/siwe/nonce`
4. User signs `message` in wallet
5. Frontend `POST /api/v1/auth/siwe/verify` with address, message, signature, chainId
6. Store `accessToken`; fetch `GET /api/v1/auth/me`
7. Redirect to intended page

Failures: nonce expired → retry; signature rejected → show error; CN blocked → `/compliance-blocked`

## 2. Browse markets

1. `/` loads market list via `GET /api/v1/markets`
2. Filter by status/category; client search on title
3. Click card → `/market/[id]`

## 3. Trade

1. Market detail loads market + orderbook (polled)
2. Select outcome, side, limit/market, size/price
3. Client validation → `POST /api/v1/orders`
4. Backend matching + CTF/UMA settlement (async)
5. UI polls orders/orderbook for status
6. Portfolio / market detail show CTF Yes/No positions (conditionId; demo or indexer)

KYC not approved: form disabled, banner shown.

## 4. Portfolio

1. `/portfolio` — balances via custody BFF; positions aggregated per market
2. Requires auth + KYC for custody endpoints

## 5. Orders

1. `/orders` — list + filter by status
2. Cancel open orders → `POST /api/v1/orders/{id}/cancel`

## 6. Compliance block (CN)

1. Any BFF response with `COMPLIANCE_CN_BLOCKED`
2. Clear session, redirect `/compliance-blocked`
3. No trading or auth persistence
