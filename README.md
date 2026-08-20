# SauceDemo Playwright

Playwright and TypeScript tests for [SauceDemo](https://www.saucedemo.com/). The suite uses the Page Object Model, covers `tests/ui/` and `tests/api/`, and runs against Chromium, Firefox, and WebKit.

## Prerequisites

- **Node.js** `>= 20` (includes **npm**)
- Git (to clone this repository)
- Network access to https://www.saucedemo.com/

### Install Node.js

1. Download the LTS build for your OS from [nodejs.org](https://nodejs.org/).
2. Run the installer (Windows/macOS) or follow the package instructions for your Linux distribution.
3. Confirm the versions:

```bash
node -v   # should print v20.x or newer
npm -v
```

On Windows you can also install with [winget](https://learn.microsoft.com/windows/package-manager/winget/): `winget install OpenJS.NodeJS.LTS`. On macOS with Homebrew: `brew install node@20`.

## Install project dependencies

From the repository root:

```bash
cd saucedemo-playwright
npm install
npx playwright install
```

- `npm install` installs the packages listed in `package.json` (`@playwright/test`, `typescript`, `dotenv`, and related types).
- `npx playwright install` downloads the browser binaries Playwright needs (Chromium, Firefox, and WebKit). For Chromium only: `npx playwright install chromium`.

## Environment

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | Application under test base URL |
| `USER_NAME` | Demo username |
| `PASSWORD` | Demo password |

`.env.example` includes the public demo credentials. If `.env` is missing, the config still loads `.env.example`.

## Run tests

```bash
npm run test:ui    # Chromium UI
npm run test:api   # API
npm test           # all projects
npm run test:list  # list only
```

| Project | Match |
|---------|-------|
| `ui-chromium` | `tests/ui/**/*.spec.ts` |
| `ui-firefox` | same |
| `ui-webkit` | same |
| `api` | `tests/api/**/*.spec.ts` |

## What is automated

| Spec | Intent |
|------|--------|
| `login.spec.ts` | Successful login; invalid credentials rejected |
| `cart.spec.ts` | Add and validate cart; multiple items; remove item |
| `session.spec.ts` | Inventory and cart survive refresh; back navigation keeps the session |
| `checkout.spec.ts` | Happy path, missing fields, whitespace-only fields, empty-cart checkout |
| `saucedemo-api.spec.ts` | Live `GET /`; mocked auth, products, and carts |

Page objects live under `pages/`.

## Assumptions and limitations

1. SauceDemo has no cart, checkout, or login REST APIs. Commerce API tests are **mocked** with Playwright routes rather than third-party APIs. See [docs/api-gaps.md](docs/api-gaps.md).
2. The live demo allows empty-cart checkout and accepts whitespace-only First Name, Last Name, and Postal Code values. The specs assert that current behavior. Per ISTQB guidance, those cases should fail in a production environment.
3. The suite does not use third-party API stand-ins.
4. Firefox and WebKit are configured; Chromium is the default `test:ui` target.

## Dependencies

| Package | Role |
|---------|------|
| `dotenv` | Load `.env` |
| `@playwright/test` | Runner and assertions |
| `@types/node` | Node types |
| `typescript` | TypeScript |

These are installed by `npm install`. Browser binaries are installed separately with `npx playwright install`.

## Docs

- [Test plan](docs/test-plan.md)
- [Gherkin](docs/features/)
- [API gaps](docs/api-gaps.md)
