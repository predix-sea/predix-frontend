# BFF Error Code Mapping (Frontend)

| BFF Code | HTTP | Frontend behavior |
|----------|------|-----------------|
| `OK` | 200 | Render data |
| `AUTH_INVALID_SIGNATURE` | 401 | Login error: invalid/rejected signature |
| `AUTH_NONCE_EXPIRED` | 401 | Prompt re-login |
| `AUTH_INVALID_TOKEN` | 401 | Clear session, redirect `/login` |
| `AUTH_UNAUTHORIZED` | 401 | Redirect `/login` |
| `COMPLIANCE_CN_BLOCKED` | 403 | Clear session → `/compliance-blocked` |
| `COMPLIANCE_KYC_REQUIRED` | 403 | Set compliance state; disable trading UI |
| `COMPLIANCE_COUNTRY_BLOCKED` | 403 | Generic region block (reserved) |
| `ORDER_INVALID_MARKET_STATUS` | 4xx | Order form error toast |
| `DOWNSTREAM_TIMEOUT` | 504 | Retry message on order/market fetch |
| `DOWNSTREAM_UNAVAILABLE` | 502 | Service unavailable banner |
| `RATE_LIMIT_EXCEEDED` | 429 | Backoff + user message |
| `VALIDATION_ERROR` | 400 | Show field-level errors |
| `INTERNAL_ERROR` | 500 | Generic error boundary |

Implementation: `services/bffClient.ts` → `mapApiError`, `setComplianceHandler`.

Analytics events:

- `login_success` / `login_failed`
- `order_submit_success` / `order_submit_failed`
- `compliance_block_redirect`
