import { expect, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async openAdmin(): Promise<void> {
    await this.page.getByRole('link', { name: /^admin$/i }).click();
    await expect(this.page.getByRole('heading', { name: /^system users$/i })).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: /logout/i }).click();
  }
}
