# Changelog

## [0.1.0] - 2026-04-15

### Added
- Initial release
- OAuth2 Client Credentials authentication via `AbacusApi` credential type
- Auto-discovery of token endpoint via `/.well-known/openid-configuration`
- Full CRUD for 10 resources: Address, Customer, Invoice, Order, Project, Subject, Payment, Delivery Note, Financial Account, Item
- Automatic pagination with `limit`/`offset`
- 401 token refresh retry (1 attempt)
- 429 rate-limit backoff with exponential delay (up to 3 retries)
- Nested address routing via `customerId`
- `flattenObject` utility for n8n expression compatibility
