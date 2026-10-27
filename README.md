# OrangeHRM QA Automation Assessment

BDD-style UI automation for the public OrangeHRM demo using Playwright, TypeScript, Cucumber and Page Object Model.

## Prerequisites
- Node.js 20 or newer
- npm
- Internet access to `https://opensource-demo.orangehrmlive.com/`

## Setup
```bash
npm install
npx playwright install chromium
```

The default demo credentials are `Admin` / `admin123`. To override them, set `ORANGEHRM_USERNAME` and `ORANGEHRM_PASSWORD` in your shell. Set `ORANGEHRM_BASE_URL` to override the URL. `HEADLESS=false` runs Chromium with a visible browser.

Example (macOS/Linux):
```bash
export ORANGEHRM_USERNAME=Admin
export ORANGEHRM_PASSWORD=admin123
npm run test:smoke
```

## Run tests
```bash
npm run test:smoke       # @Smoke only
npm run test:regression  # @Regression only
npm test                 # all scenarios
npm run typecheck        # TypeScript static type check
node scripts/open-report.js  # generate HTML report after npm test
```

Cucumber writes `reports/cucumber-report.json`. The HTML report is generated at `reports/html/index.html`. Screenshots are saved to `reports/screenshots/` when a scenario fails. Reports are git-ignored.

## Implemented scenarios
See [`TEST-INVENTORY.md`](TEST-INVENTORY.md). The Gherkin scenarios are in `features/user-management.feature`; their step implementations are in `src/steps/userManagement.steps.ts`.

1. `@Smoke`: login, open Admin/System Users, search for `Admin`, assert the matching result, logout, assert the login button is visible.
2. `@Regression`: login, open System Users, create a uniquely named enabled ESS user, assert success notification, search for the new username, assert the row is present, logout.

## Design decisions
- **BDD/Gherkin**: makes expected business behavior reviewable by QA, engineering and product stakeholders.
- **Page Object Model**: centralizes UI interactions and keeps step definitions focused on intent.
- **Playwright assertions/auto-waiting**: avoids fixed sleeps; assertions wait for observable UI state.
- **Unique test data**: reduces collisions in a shared public demo.
- **Failure evidence**: failure screenshots and a Cucumber JSON report support triage.
- **No retries by default**: retries can mask instability; fix the underlying cause before adding a carefully justified retry policy.
- **Serial execution**: protects a shared demo from concurrent data collisions and makes the small suite easier to debug.

## Assumptions and limitations
- The demo URL, credentials, seeded employee suggestions and UI labels are externally managed and may change.
- The demo is shared by other users and may be slow, reset, or unavailable.
- The create-user flow depends on the demo having an employee suggestion matching `Linda`; verify the suggestion in the live UI before submission.
- This is UI-level coverage only. It does not validate backend APIs, database state directly, role-permission matrices, or true SIT integration boundaries.
- Credentials are configurable by environment variables; do not commit real secrets.


## Suggested improvements
1. Add negative login, required-field, duplicate username and edit-user scenarios.
2. Add API-level setup/cleanup where a supported API exists, while keeping one or two end-to-end UI checks.
3. Add explicit accessibility and role-based authorization checks.
4. Publish HTML reports as CI artifacts and record duration/trend metrics.
5. Add deterministic test-data cleanup or a dedicated test tenant; do not rely on shared public-demo data being stable.
6. Add a browser matrix only when it provides meaningful release coverage.

## Classification rationale
- **Smoke**: a short, high-value path validating that an administrator can authenticate, reach the user list, search, and exit.
- **Regression**: user creation and read-back validate a wider functional path and persisted UI state.
- **SIT**: not applicable to the current scope because only the public application UI is under test; do not use the tag just to increase coverage labels.

## Submission checklist
- [ ] `npm install` succeeds
- [ ] `npx playwright install chromium` succeeds
- [ ] `npm run typecheck` succeeds
- [ ] `npm run test:smoke` passes against the live demo
- [ ] `npm run test:regression` passes against the live demo
- [ ] Review screenshots/report and fix any environment-specific issues
- [ ] Ensure no `.env`, `node_modules`, or generated reports are committed


## Local Verification Results

The test suite was executed locally against the OrangeHRM public demo.

| Verification | Result |
|---|---|
| Smoke tests | 1 scenario passed, 6 steps passed |
| Regression tests | 1 scenario passed, 8 steps passed |
| Full test suite | 2 scenarios passed, 14 steps passed |
| TypeScript type check | Passed with no compilation errors |

The smoke and regression tests were executed separately, followed by the complete Cucumber test suite.