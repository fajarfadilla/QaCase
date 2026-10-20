# WeMine Test Cases

Test cases for [WeMine](../case.md): the WeMine mobile app, the WeMineOffice web app and their backend services. Cases are split into **manual** and **automation**, one file per flow, and every term used in them is defined in the [glossary](../GLOSSARY.md).

## Repository Structure

```
QaCase/
├── case.md                      ← the case being tested
├── GLOSSARY.md                  ← domain terms used in every case (Tenant, PIC, Followup Task…)
├── testcases/
│   ├── readme.md                ← this file
│   ├── manual/                  ← cases run by a tester
│   │   ├── flow-0-sign-in.md
│   │   ├── flow-1-equipment-inspection.md
│   │   ├── flow-2-hazard-report.md
│   │   └── system-wide.md       ← tenant isolation, offline sync, Master Data, sessions
│   └── automation/              ← cases implemented (or planned) as automated specs
│       └── (same four files)
├── automation/                  ← Playwright + Maestro project, see automation/README.md
└── .github/workflows/           ← CI for the automation project
```

## Coverage

| Area | Manual | Automation | Automated now |
|------|--------|------------|---------------|
| [Flow 0 - Sign In](./manual/flow-0-sign-in.md) | 14 | [5](./automation/flow-0-sign-in.md) | 2 |
| [Flow 1 - Equipment Inspection](./manual/flow-1-equipment-inspection.md) | 24 | [9](./automation/flow-1-equipment-inspection.md) | 1 |
| [Flow 2 - Safety Hazard Report](./manual/flow-2-hazard-report.md) | 24 | [11](./automation/flow-2-hazard-report.md) | 5 |
| [System-wide](./manual/system-wide.md) | 19 | [4](./automation/system-wide.md) | 1 |
| **Total** | **81** | **29** | **9** |

"Automated now" counts automation cases that have an example spec; the rest are marked `Planned`.

## How to Read the Test Cases

Each case file has up to four sections:

| Section | What it holds |
|---------|---------------|
| **Assumptions** | Where the case is ambiguous: what it says, the assumption the cases are written against, which cases depend on it, and the question for the PO |
| **Test Data** | The Tenants, people and places the cases use (defined once in Flow 2 and linked from the others) |
| **Field Coverage** | Flow 2 only: every form field, whether it is mandatory, and which cases check it |
| **Test Cases** | The cases themselves |

### Case IDs

`<Area>-<Category>-<Number>`, for example `HZ-M-002` or `SW-A-001`.

| Part | Values |
|------|--------|
| Area | `SI` Sign In · `EI` Equipment Inspection · `HZ` Hazard Report · `SW` System-wide |
| Category | `M` manual · `A` automation |
| Number | Sequential per area and category |

### Columns

| Column | Meaning |
|--------|---------|
| ID | The case ID |
| Title | What the case checks |
| Priority | **P1 (High)**: core flow or data/security risk; a failure blocks release. **P2 (Medium)**: important behaviour with a workaround. **P3 (Low)**: rare edge or cosmetic |
| Test Type | **Positive** · **Negative** · **Edge Case** (limits and unusual input) · **State transition** · **Offline** · **Security** · **Notification** |
| Preconditions | What must be true before step 1 |
| Steps | Numbered actions |
| Expected Result | One numbered result **per step**: result *n* is checked after step *n*. `(AS-nn)` marks a result that depends on an assumption |
| Level | Automation only: **API**, **Web** (WeMineOffice) or **Mobile** (WeMine) |
| Spec | Automation only: the file that implements the case, or `Planned` |

### Recording a Run

When running manual cases, mark each case **Pass**, **Fail** (note the failing step number and what happened instead), or **Blocked** (note the blocking case or assumption). A case passes only if every numbered expected result passes.

## How to Read the Automation Results

The automation specs are **examples only** (AS-43): there is no WeMine environment, APK or API to run them against. They are written against the API and UI assumed in [automation/README.md](../automation/README.md).

**CI** ([`.github/workflows/automation.yml`](../.github/workflows/automation.yml)) runs on every change to `automation/`:

| Check | Green means |
|-------|-------------|
| `pnpm format:check` | All code is formatted with oxfmt |
| `pnpm typecheck` | Every spec, helper and page object compiles |
| `pnpm test:list` | Playwright discovers every spec (currently 8: 7 API, 1 web) |

**Against a real environment** (`pnpm test` with `WEMINE_API_URL` and `WEMINEOFFICE_URL` set), Playwright prints a list and writes an HTML report (`pnpm exec playwright show-report`):

- Each **test title starts with its case ID**, so a failure maps straight to its row in `testcases/automation/`.
- Each **step in the report is the numbered step from the case**, so a failing step shows exactly which expected result was not met.
- Every spec is **tagged with its priority**: `pnpm test --grep @P1` runs only P1 cases.
- With `CI` set, failed tests are retried twice and the retry records a trace, which opens from the report.

The mobile flow runs with `maestro test mobile/hazard-offline.yaml`; Maestro prints each command as it passes or fails, grouped under the same numbered step comments.

## Why These Tools

| Tool | Why |
|------|-----|
| **Markdown tables** for cases | Reviewable and diffable in pull requests, render on GitHub without extra tooling, and live next to the code they describe. A test management tool (TestRail, Zephyr) would be the next step for tracking run history |
| **Playwright Test** (TypeScript) | One runner for both **API** and **web** tests, with a built-in API client, so the backend contract and WeMineOffice are tested the same way. It can simulate **offline and slow networks** (`context.setOffline`, request routing), which matters for an offline-first product. Built-in HTML report, traces, tags and parallel runs |
| **Maestro** | Mobile flows are short, readable YAML that manual testers can review against their own cases. It runs on Android and iOS, waits for elements automatically (less flaky than scripted waits) and can toggle **airplane mode** on Android for offline tests |
| **TypeScript** | Payload and response types catch broken specs at compile time, which is the only check possible without an environment |
| **pnpm** · **oxfmt** · **GitHub Actions** | Fast, lockfile-pinned installs; a fast formatter so style never shows up in review; CI on every push |

Alternatives considered:

- **Cypress**: less suited to API-heavy suites and to flows with several users or tabs, which notifications and tenant isolation need.
- **Appium**: more powerful, but much heavier setup and slower, more brittle scripts than Maestro for flows like these.
- **Katalon Studio**: a good fit for low-code teams that want web, API and mobile in one tool with built-in test management, but its tests are hard to review in a repo, running them in CI needs a paid Runtime Engine license, and it has no built-in offline simulation.
- **k6 / JMeter**: performance testing (e.g. large Master Data downloads) is out of scope for this case and noted as future work.

## Open Questions

There are **49 assumptions** (AS-01 – AS-49), each with a question for the PO. They are in the **Assumptions** section of each case file:

- Product behaviour: [Flow 0](./manual/flow-0-sign-in.md#assumptions) · [Flow 1](./manual/flow-1-equipment-inspection.md#assumptions) · [Flow 2](./manual/flow-2-hazard-report.md#assumptions) · [System-wide](./manual/system-wide.md#assumptions)
- Automation constraints: [Flow 0](./automation/flow-0-sign-in.md#assumptions) · [Flow 1](./automation/flow-1-equipment-inspection.md#assumptions) · [Flow 2](./automation/flow-2-hazard-report.md#assumptions) · [System-wide](./automation/system-wide.md#assumptions)

The highest-impact questions are who counts as "people in the area" (AS-22), what happens to offline records whose Master Data changed before sync (AS-35), and which WeMineOffice features must work offline (AS-39).
