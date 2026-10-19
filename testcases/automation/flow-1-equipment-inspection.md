# Flow 1 - Equipment Inspection (Automation)

## Assumptions

Product assumptions for this flow are listed in [manual/flow-1-equipment-inspection.md](../manual/flow-1-equipment-inspection.md#assumptions). These are specific to automation.
| ID | Ambiguity | Assumption | Affects | Question for PO |
|----|-----------|------------|---------|-----------------|
| AS-44 | No real WeMine environment, APK or API is available | Automation specs are examples only: they are written against the assumed API and UI but are not run, because there is no environment to run them against. CI only checks that they compile and are discovered | EI-A-001 – EI-A-009 | Is there a test or staging environment and a test build we can target? |
| AS-45 | Microsoft SSO can't be automated reliably, and no test accounts are available | Specs get a token for each test account from a test-only auth helper instead of signing in through Microsoft; the real Microsoft login is covered by manual cases | EI-A-001 – EI-A-009 | Can the test environment issue tokens for test accounts without the Microsoft UI? |
| AS-46 | The case gives only three API paths (`/user/who`, `/user/me`, `/tenant/master`) and no methods, payloads or status codes | Every other path, and all methods, payloads and status codes, are assumed and documented in `automation/README.md` | EI-A-001 – EI-A-008 | Where is the API specification (e.g. OpenAPI)? |
| AS-49 | The WeMineOffice and WeMine UIs are not available to inspect | Web and mobile specs find elements by assumed labels and accessible names (e.g. an "Add Field" button) | EI-A-009 | Do WeMineOffice and WeMine expose stable test IDs or accessibility labels for automation? |

## Test Data

The test environment is seeded with the Tenant A and Tenant B people and places from [Flow 2 Test Data](../manual/flow-2-hazard-report.md#test-data), plus an admin account for each Tenant (`admin.a`, `admin.b`).

## Test Cases

| ID | Title | Priority | Test Type | Level | Preconditions | Steps | Expected Result | Spec |
|----|-------|----------|-----------|-------|---------------|-------|-----------------|------|
| EI-A-001 | Create a Form with every Field type | P1 (High) | Positive | API | Token for `admin.a` | 1. POST `/equipment/forms` with Form Code `EI-PUMP-01` and one Field of each type: Text, Date Picker, Select (3 options), Radio (4 options), Image Picker<br>2. GET the Form by its ID | 1. Status 201; the body contains the Form ID<br>2. Status 200; the Fields' types, labels, options and order match the request | Planned |
| EI-A-002 | Accept a Form with exactly 50 Fields | P1 (High) | Edge Case | API | Token for `admin.a` | 1. POST `/equipment/forms` with 50 Fields | 1. Status 201; the saved Form has 50 Fields | Planned |
| EI-A-003 | Reject a Form with 51 Fields | P1 (High) | Edge Case | API | Token for `admin.a` | 1. POST `/equipment/forms` with 51 Fields and Form Code `EI-TOO-MANY`<br>2. GET `/equipment/forms` | 1. Status 400; the error mentions the 50-Field limit<br>2. No Form with Form Code `EI-TOO-MANY` exists | Planned |
| EI-A-004 | Reject a Radio Field with too many or too few options | P1 (High) | Edge Case | API | Token for `admin.a` | 1. POST `/equipment/forms` with a Radio Field with 5 options<br>2. POST `/equipment/forms` with a Radio Field with 1 option | 1. Status 400; the error mentions the 4-option maximum<br>2. Status 400; the error mentions the 2-option minimum (AS-12) | Planned |
| EI-A-005 | Form Code is unique per Tenant | P2 (Medium) | Negative | API | Form `EI-PUMP-01` exists in Tenant A; tokens for `admin.a` and `admin.b` | 1. POST `/equipment/forms` with Form Code `EI-PUMP-01` as `admin.a`<br>2. POST `/equipment/forms` with Form Code `EI-PUMP-01` as `admin.b` | 1. Status 409; the error says the Form Code already exists<br>2. Status 201 (AS-11) | Planned |
| EI-A-006 | A non-admin Employee can't create a Form | P2 (Medium) | Security | API | Token for `rina` | 1. POST `/equipment/forms` with a valid Form | 1. Status 403; no Form is created (AS-14) | Planned |
| EI-A-007 | Submit an Inspection Submission | P1 (High) | Positive | API | Form `EI-PUMP-01` exists with a mandatory Text Field; token for `rina` | 1. POST `/equipment/inspections` with Form Code `EI-PUMP-01` and a value for every Field<br>2. GET the Inspection Submission by its ID | 1. Status 201; the body contains the Inspection Submission ID<br>2. Status 200; every value matches the request | Planned |
| EI-A-008 | Reject an Inspection Submission missing a mandatory Field | P1 (High) | Negative | API | Form `EI-PUMP-01` exists with a mandatory Text Field; token for `rina` | 1. POST `/equipment/inspections` without a value for the mandatory Text Field | 1. Status 400; the error names the missing Field; nothing is saved (AS-13) | Planned |
| EI-A-009 | Form Builder UI blocks the 51st Field and the 5th Radio option | P1 (High) | Edge Case | Web | Signed in to WeMineOffice as `admin.a` with a test session (AS-45) | 1. Create a Form and add 50 Fields<br>2. Try to add another Field<br>3. Create another Form and add a Radio Field with 4 options<br>4. Try to add a 5th option | 1. All 50 Fields are listed<br>2. Add Field is disabled or a "Maximum 50 Fields" message is shown<br>3. All 4 options are listed<br>4. Add option is disabled or a "Maximum 4 options" message is shown | `automation/tests/web/form-builder.spec.ts` |
