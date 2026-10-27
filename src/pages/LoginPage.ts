
import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(
      process.env.ORANGEHRM_BASE_URL ??
        'https://opensource-demo.orangehrmlive.com/'
    );
  }

  async login(
    username = process.env.ORANGEHRM_USERNAME ?? 'Admin',
    password = process.env.ORANGEHRM_PASSWORD ?? 'admin123'
  ): Promise<void> {
    await this.page
      .getByRole('textbox', { name: /username/i })
      .fill(username);

    await this.page
      .getByRole('textbox', { name: /password/i })
      .fill(password);

    await this.page
      .getByRole('button', { name: /login/i })
      .click();

    await expect(this.page).toHaveURL(/\/dashboard\/index/, {
      timeout: 30000,
    });

    await expect(this.page.locator('.oxd-sidepanel')).toBeVisible({
      timeout: 15000,
    });
  }

  async expectLoginVisible(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: /login/i })
    ).toBeVisible({ timeout: 15000 });
  }
}
