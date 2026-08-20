# SauceDemo API Gaps

Supports section 2 of the test plan (API validation).

SauceDemo has no commerce REST API for login, cart, or checkout. Those flows are client-side only.

## What the API suite covers

`tests/api/saucedemo-api.spec.ts`:

| Check | Mode |
|-------|------|
| `GET /` | Live host smoke (expect 200) |
| `POST /auth/login` | Mocked with Playwright `page.route` |
| `GET /products` | Mocked with Playwright `page.route` |
| `GET /carts` | Mocked with Playwright `page.route` |

Mocks stay on the SauceDemo origin and do not call DummyJSON, FakeStore, or ReqRes. They stand in for commerce API contracts that the application under test does not expose.

Purchase-path coverage lives in `tests/ui/`.
