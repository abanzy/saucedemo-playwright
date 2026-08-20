# Test Plan - SauceDemo QA Challenge

**AUT:** https://www.saucedemo.com/  
**Credentials (demo):** `standard_user` / `secret_sauce`  
**Focus:** Purchase path under a ~1 hour timebox  

## 1. Scope and Objectives

- **In scope:** Login (valid, invalid, and locked-out), cart add/validate/remove/multi-item, session refresh and back navigation, happy-path checkout, missing required fields, whitespace-only First/Last/Postal (accepted by the demo), empty-cart checkout, Gherkin (at least five scenarios), and API validation (live host smoke plus mocked commerce routes).
- **Out of scope:** Third-party APIs as stand-ins for SauceDemo; CI, visual, and accessibility suites; large framework kits.
- **Objectives:** Deliver a concise test plan, Gherkin scenarios, Playwright automation, and a README, with purchase-path risk covered first.

## 2. Test Approach

- **Functional testing:** Risk-based coverage of login, cart, and checkout behaviors that affect purchase completion.
- **UI validation:** Assert visible outcomes (URLs, error text, cart lines, confirmation header) against the live AUT.
- **Integration testing:** Treat login → inventory → cart → checkout as one client-side session; use a fresh browser context per UI test so state does not leak.
- **API validation:** Live `GET /` host smoke; mocked `/auth/login`, `/products`, and `/carts` via Playwright routes (SauceDemo has no commerce REST API). See `docs/api-gaps.md`.
- Explore, then plan and write Gherkin, automate those scenarios, and document API limits.

## 3. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Purchase-path defects | Automate the happy path; assert confirmation URL and thank-you text |
| Empty cart can complete checkout | Assert current demo behavior; flag as a defect (should fail in production per ISTQB) |
| Missing or invalid checkout fields | Parametrize blank fields; assert the user stays on step one with error text |
| Whitespace-only First/Last/Postal accepted | Assert current demo behavior; flag as a defect (should fail in production per ISTQB) |
| Locked-out / invalid credentials | Automate invalid and locked-out login; assert error and no inventory access |
| No commerce REST API | Live host smoke plus mocked auth/products/carts; document in api-gaps |
| Time pressure | Keep the page object model thin; mirror Gherkin with focused UI specs |

## 4. Entry and Exit Criteria

- **Entry:** The AUT is reachable at https://www.saucedemo.com/; demo credentials are known; this plan is agreed as scope.
- **Exit:** This plan, at least five Gherkin scenarios, UI specs green on Chromium for the Gherkin set, API gaps documented, and README complete.

## 5. Environment Requirements

- **AUT URL:** https://www.saucedemo.com/
- **Browsers:** Chromium, Firefox, WebKit.
- **Test data:** `standard_user` / `secret_sauce`; `locked_out_user` for locked-out login; isolated session per UI test.
- **Tooling:** Playwright + TypeScript, Page Object Model; `.env` / `.env.example` for base URL and credentials (`.env` not committed).
- **Traffic:** Light use of the public demo only.

## Mini RTM

| Req / ID | Behavior | Coverage |
|----------|----------|----------|
| UI-01 | Happy-path checkout | Automated UI |
| UI-02 | Missing required fields | Automated UI |
| UI-03 | Empty-cart checkout | Automated UI |
| UI-04 | Successful login | Automated UI |
| UI-05 | Invalid login | Automated UI |
| UI-06 | Cart add / validate | Automated UI |
| UI-07 | Multiple cart items | Automated UI |
| UI-08 | Remove item from cart | Automated UI |
| UI-09 | Refresh after login | Automated UI |
| UI-10 | Locked-out login | Automated UI |
| UI-11 | Whitespace-only First/Last/Postal (accepted by the demo) | Automated UI |
| UI-12 | Back navigation between inventory and cart | Automated UI |
| API | Live GET / plus mocked auth/products/carts | Documented |
