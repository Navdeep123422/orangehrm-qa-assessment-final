import {
  Given,
  When,
  Then,
  setDefaultTimeout,
} from '@cucumber/cucumber';

setDefaultTimeout(30_000);
import { expect } from '@playwright/test';
import { OrangeHrmWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';

function uniqueUsername(): string {
  return `qa_user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

Given('the administrator is logged in', async function (this: OrangeHrmWorld) {
  const login = new LoginPage(this.page);
  await login.open();
  await login.login();
});

When('the administrator opens user management', async function (this: OrangeHrmWorld) {
  await new DashboardPage(this.page).openAdmin();
});

When('searches for the existing username {string}', async function (this: OrangeHrmWorld, username: string) {
  await new AdminPage(this.page).searchUser(username);
});

Then('the user search results should contain username {string}', async function (this: OrangeHrmWorld, username: string) {
  await new AdminPage(this.page).expectSearchResult(username);
});

When('creates a new enabled ESS user with a unique username', async function (this: OrangeHrmWorld) {
  this.createdUsername = uniqueUsername();
  await new AdminPage(this.page).createEnabledEssUser(this.createdUsername);
});

Then('a successful save notification should be displayed', async function (this: OrangeHrmWorld) {
  await new AdminPage(this.page).expectSuccessNotification();
});

When('the administrator searches for the newly created username', async function (this: OrangeHrmWorld) {
  await new AdminPage(this.page).searchUser(this.createdUsername);
});

Then('the user search results should contain the newly created username', async function (this: OrangeHrmWorld) {
  expect(this.createdUsername).not.toBe('');
  await new AdminPage(this.page).expectSearchResult(this.createdUsername);
});

When('the administrator logs out', async function (this: OrangeHrmWorld) {
  await new DashboardPage(this.page).logout();
});

Then('the login page should be displayed', async function (this: OrangeHrmWorld) {
  await new LoginPage(this.page).expectLoginVisible();
});
