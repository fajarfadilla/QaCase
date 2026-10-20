# WeMine Automation

Example automation for WeMine. The test cases these specs implement are documented in [testcases/automation](../testcases/automation).

> **Example specs only (AS-43).** There is no WeMine environment, APK or API to run against, so the specs are written against the assumed API and UI below. CI only checks that they compile and are discovered.

## Tools

| Tool                                                   | Used for                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| [Playwright Test](https://playwright.dev) (TypeScript) | API specs (`tests/api`) and WeMineOffice web specs (`tests/web`) |
| [Maestro](https://maestro.mobile.dev)                  | WeMine mobile flows (`mobile/`)                                  |

## Structure

```
automation/
├── helpers/
│   ├── env.ts             ← API and web base URLs
│   ├── auth.ts            ← token for a test account, skipping Microsoft login (AS-44)
│   ├── fixtures.ts        ← `apiAs(username)`: an API client signed in as that account
│   ├── hazards.ts         ← builds and creates Hazards and Followup Tasks for specs
│   ├── notifications.ts   ← reads who was notified (AS-46)
│   ├── test-data.ts       ← seeded users, Tenants and places
│   └── web-session.ts     ← signs WeMineOffice in as a test account (AS-44)
├── pages/                 ← page objects for WeMineOffice (element names assumed, AS-48)
├── tests/
│   ├── api/               ← Playwright API specs
│   └── web/               ← Playwright WeMineOffice specs
├── mobile/                ← Maestro flows, with `assets/` for media they add to the device
└── playwright.config.ts   ← projects: `api`, `web`
```

Each test title starts with its case ID (e.g. `HZ-A-001`), so a result in the report maps back to its row in `testcases/automation`.

## Running

```sh
pnpm install
pnpm typecheck      # compile all specs
pnpm test:list      # list every spec Playwright discovers
pnpm test           # run against a real environment (see below)
pnpm format         # format with oxfmt

maestro test mobile/hazard-offline.yaml   # mobile flow, needs an Android test build (AS-49)
```

| Variable           | Default (placeholder)        | Meaning                 |
| ------------------ | ---------------------------- | ----------------------- |
| `WEMINE_API_URL`   | `https://api.wemine.test`    | WeMine backend base URL |
| `WEMINEOFFICE_URL` | `https://office.wemine.test` | WeMineOffice base URL   |

## Assumed API (AS-45)

The case only names `/user/who`, `/user/me` and `/tenant/master`, without methods, payloads or status codes. Everything below is assumed and should be replaced by the real API specification.

| Method | Path                            | Request body                                                                            | Success                                                                                | Errors                                                               |
| ------ | ------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| POST   | `/user/who`                     | `{ username }`                                                                          | 200 `{ tenantId, tenantName }`                                                         | 400 empty username, 404 unknown username                             |
| GET    | `/user/me`                      | —                                                                                       | 200 `{ id, username, name, tenantId }`                                                 | 401                                                                  |
| GET    | `/tenant/master`                | —                                                                                       | 200 `{ endpoints: [{ name, path }] }`                                                  | 401                                                                  |
| GET    | `/tenant/master/{name}`         | —                                                                                       | 200 list of that Master Data                                                           | 401                                                                  |
| POST   | `/files`                        | multipart file                                                                          | 201 `{ id }`                                                                           | 400, 401                                                             |
| POST   | `/equipment/forms`              | `{ formCode, fields: [{ type, label, mandatory, options? }] }`                          | 201 `{ id }`                                                                           | 400 limits, 403 not admin, 409 duplicate Form Code                   |
| GET    | `/equipment/forms/{id}`         | —                                                                                       | 200 Form                                                                               | 404                                                                  |
| POST   | `/equipment/inspections`        | `{ clientId, formCode, values }`                                                        | 201 `{ id }`                                                                           | 400 missing mandatory Field                                          |
| POST   | `/safety/hazards`               | `{ clientId, locationId, sublocationId, areaId, areaDescription?, evidenceIds, picId }` | 201 `{ id, status: "OPEN", followupTask: { id, picId } }`                              | 400 missing or mismatched field, 404 PIC not found                   |
| GET    | `/safety/hazards?clientId=`     | —                                                                                       | 200 Hazards the caller reported or is PIC of (AS-21), optionally filtered by client ID | 401                                                                  |
| GET    | `/safety/hazards/{id}`          | —                                                                                       | 200 Hazard with its Followup Task                                                      | 404 not found or other Tenant                                        |
| GET    | `/safety/followup-tasks`        | —                                                                                       | 200 Followup Tasks assigned to the caller                                              | 401                                                                  |
| POST   | `/safety/hazards/{id}/followup` | `{ evidenceIds?, resolutionDate, coObserverIds? }`                                      | 200 Hazard with status `RESOLVED`                                                      | 400 invalid, 403 not the PIC, 404 other Tenant, 409 already resolved |

Test-only endpoints the test environment is assumed to provide:

| Method | Path                                    | Purpose                                                              |
| ------ | --------------------------------------- | -------------------------------------------------------------------- |
| POST   | `/test/auth/token`                      | `{ username }` → `{ accessToken }` for a seeded test account (AS-44) |
| GET    | `/test/notifications?recipient=&since=` | Notifications an Employee received since a time (AS-46)              |
