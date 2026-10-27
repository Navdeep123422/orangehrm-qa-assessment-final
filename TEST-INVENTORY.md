# Test inventory

| ID | Scenario | Tag | Purpose |
|---|---|---|---|
| ORH-001 | Admin logs in, searches for Admin, logs out | `@Smoke` | Quick confidence in authentication, Admin navigation, search and logout |
| ORH-002 | Admin creates an enabled ESS user and verifies it via search | `@Regression` | Exercises the core create/save/read-back workflow |

## Coverage and boundaries
- Smoke: a quick critical-path check intended for frequent execution.
- Regression: broader functional validation of user creation and persistence.
- SIT: intentionally not tagged. This project tests the public UI; it does not validate integration contracts between independently controlled systems.
- The demo is public/shared. The create-user test generates a unique username but creates persistent data if the demo does not reset it.
