# System-wide (Automation)

## Assumptions

Product assumptions for this area are listed in [manual/system-wide.md](../manual/system-wide.md#assumptions). These are specific to automation.
| ID | Ambiguity | Assumption | Affects | Question for PO |
|----|-----------|------------|---------|-----------------|
| AS-34 | No real WeMine environment, APK or API is available | Automation specs are examples only: they are written against the assumed API and UI but are not run, because there is no environment to run them against. CI only checks that they compile and are discovered | SW-A-001 – SW-A-004 | Is there a test or staging environment and a test build we can target? |
| AS-35 | Microsoft SSO can't be automated reliably, and no test accounts are available | Specs get a token for each test account from a test-only auth helper instead of signing in through Microsoft; the real Microsoft login is covered by manual cases | SW-A-001 – SW-A-004 | Can the test environment issue tokens for test accounts without the Microsoft UI? |
| AS-36 | The case gives only three API paths (`/user/who`, `/user/me`, `/tenant/master`) and no methods, payloads or status codes | Every other path, and all methods, payloads and status codes, are assumed and documented in `automation/README.md` | SW-A-001 – SW-A-004 | Where is the API specification (e.g. OpenAPI)? |

## Test Data

The test environment is seeded with the Tenant A and Tenant B people and places from [Flow 2 Test Data](../manual/flow-2-hazard-report.md#test-data), with usernames `rina`, `paul`, `maya`, `omar`, `sam` (Tenant A) and `tara` (Tenant B).

## Test Cases

| ID | Title | Priority | Test Type | Level | Preconditions | Steps | Expected Result | Spec |
|----|-------|----------|-----------|-------|---------------|-------|-----------------|------|
| SW-A-001 | Another Tenant's Hazard can't be read | P1 (High) | Security | API | A Hazard in Tenant B reported by Tara; token for `rina` | 1. GET `/safety/hazards/{id}` for the Tenant B Hazard with Rina's token | 1. Status 404; the body contains no Tenant B data (AS-27) | `automation/tests/api/tenant-isolation.spec.ts` |
| SW-A-002 | Another Tenant's Followup Task can't be submitted | P1 (High) | Security | API | An `OPEN` Hazard in Tenant B; tokens for `paul` and `tara` | 1. POST `/safety/hazards/{id}/followup` for the Tenant B Hazard with Paul's token<br>2. GET the Hazard with Tara's token | 1. Status 404<br>2. The Hazard status is still `OPEN` and its Followup Task is unchanged (AS-27) | Planned |
| SW-A-003 | Master Data and references stay within the Employee's Tenant | P1 (High) | Security | API | Token for `rina` | 1. GET the employees Master Data endpoint<br>2. GET the forms Master Data endpoint<br>3. POST `/safety/hazards` with PIC Tara | 1. Status 200; Tara is not in the list<br>2. Status 200; only Tenant A Forms are listed<br>3. Status 400 or 404; the error says the PIC was not found; no Hazard is created (AS-27) | Planned |
| SW-A-004 | Protected endpoints reject missing or invalid tokens | P2 (Medium) | Security | API | A valid and an expired token for `rina`; runs against `/user/me`, `/tenant/master` and `/safety/hazards` | 1. Call each endpoint without a token<br>2. Call each endpoint with the expired token<br>3. Call each endpoint with the valid token after altering one character<br>4. Call each endpoint with the valid token | 1. Status 401 for every endpoint<br>2. Status 401 for every endpoint<br>3. Status 401 for every endpoint<br>4. Status 200 for every endpoint | Planned |
