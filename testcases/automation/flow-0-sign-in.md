# Flow 0 - Sign In (Automation)

## Assumptions

Product assumptions for this flow are listed in [manual/flow-0-sign-in.md](../manual/flow-0-sign-in.md#assumptions). These are specific to automation.
| ID | Ambiguity | Assumption | Affects | Question for PO |
|----|-----------|------------|---------|-----------------|
| AS-34 | No real WeMine environment, APK or API is available | Automation specs are examples only: they are written against the assumed API and UI but are not run, because there is no environment to run them against. CI only checks that they compile and are discovered | SI-A-001 – SI-A-005 | Is there a test or staging environment and a test build we can target? |
| AS-35 | Microsoft SSO can't be automated reliably, and no test accounts are available | Specs get a token for each test account from a test-only auth helper instead of signing in through Microsoft; the real Microsoft login is covered by manual cases | SI-A-004, SI-A-005 | Can the test environment issue tokens for test accounts without the Microsoft UI (e.g. client credentials or a test identity provider)? |
| AS-36 | The case gives only three API paths (`/user/who`, `/user/me`, `/tenant/master`) and no methods, payloads or status codes | Every other path, and all methods, payloads and status codes, are assumed and documented in `automation/README.md` | SI-A-001 – SI-A-005 | Where is the API specification (e.g. OpenAPI)? |

## Test Data

The test environment is seeded with the Tenant A and Tenant B people and places from [Flow 2 Test Data](../manual/flow-2-hazard-report.md#test-data), with usernames `rina`, `paul`, `maya`, `omar`, `sam` (Tenant A) and `tara` (Tenant B).

## Test Cases

| ID | Title | Priority | Test Type | Level | Preconditions | Steps | Expected Result | Spec |
|----|-------|----------|-----------|-------|---------------|-------|-----------------|------|
| SI-A-001 | `/user/who` resolves the Tenant for a registered username | P1 (High) | Positive | API | Test data seeded | 1. POST `/user/who` with `{ "username": "rina" }` | 1. Status 200; the body contains Tenant A's ID and name | `automation/tests/api/sign-in.spec.ts` |
| SI-A-002 | `/user/who` rejects an unknown username | P1 (High) | Negative | API | Test data seeded | 1. POST `/user/who` with `{ "username": "ghost.user" }` | 1. Status 404; the body has an error message and no Tenant data (AS-01) | `automation/tests/api/sign-in.spec.ts` |
| SI-A-003 | `/user/who` ignores case and surrounding spaces | P2 (Medium) | Edge Case | API | Test data seeded | 1. POST `/user/who` with `{ "username": "Rina" }`<br>2. POST `/user/who` with `{ "username": " rina " }`<br>3. POST `/user/who` with `{ "username": "" }` | 1. Status 200 with Tenant A<br>2. Status 200 with Tenant A<br>3. Status 400 with a validation error (AS-02) | Planned |
| SI-A-004 | `/user/me` returns the signed-in Employee's profile | P1 (High) | Positive | API | Tokens for `rina` and `tara` (AS-35) | 1. GET `/user/me` with Rina's token<br>2. GET `/user/me` with Tara's token | 1. Status 200; the body has Rina's ID and name and Tenant A<br>2. Status 200; the body has Tara's ID and name and Tenant B | Planned |
| SI-A-005 | `/tenant/master` lists the Master Data endpoints and each one returns data | P1 (High) | Positive | API | Token for `rina` (AS-35) | 1. GET `/tenant/master`<br>2. GET every endpoint it lists<br>3. Compare the Location, Sublocation and Area lists | 1. Status 200; the body lists endpoints for locations, sublocations, areas, employees and forms<br>2. Every endpoint returns status 200 with a non-empty list<br>3. Every Sublocation references a listed Location, and every Area references a listed Sublocation | Planned |
