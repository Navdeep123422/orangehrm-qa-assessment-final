
import { expect, Locator, Page } from '@playwright/test';

export class AdminPage {
  constructor(private readonly page: Page) {}

  private get usernameSearch(): Locator {
    return this.page
      .locator('.oxd-form')
      .first()
      .getByRole('textbox')
      .first();
  }

  async searchUser(username: string): Promise<void> {
    await this.usernameSearch.fill(username);

    await this.page
      .getByRole('button', { name: /^search$/i })
      .click();

    await expect(
      this.page.locator('.oxd-table-body')
    ).toBeVisible();
  }

  async expectSearchResult(username: string): Promise<void> {
    const rows = this.page.locator(
      '.oxd-table-body .oxd-table-row'
    );

    await expect(
      rows.filter({
        has: this.page
          .locator('.oxd-table-cell:nth-child(2)')
          .getByText(username, { exact: true }),
      })
    ).toHaveCount(1);
  }

  async createEnabledEssUser(username: string): Promise<void> {
    await this.page.getByRole('button', { name: /add/i }).click();

    await expect(
      this.page.getByRole('heading', { name: /add user/i })
    ).toBeVisible();

    const dropdowns = this.page.locator(
      '.oxd-form-row .oxd-select-text'
    );

    // Select ESS.
    await dropdowns.nth(0).click();
    await this.page.getByRole('option', { name: /^ess$/i }).click();

    // Search for an employee.
    const employeeName = this.page.getByPlaceholder(
      /type for hints/i
    );

    await employeeName.fill('Ranga');

    const dropdown = this.page.locator(
      '.oxd-autocomplete-dropdown'
    );

    const employeeOptions = dropdown.locator(
      '.oxd-autocomplete-option'
    );

    // Wait for a real result, not the loading or empty-state message.
    const validOptions = employeeOptions.filter({
      hasNotText: /searching|no records found/i,
    });

    await expect
      .poll(
        async () => {
          const options = await validOptions.allTextContents();
          return options.some((option) => option.trim().length > 0);
        },
        { timeout: 15000, message: 'No employee suggestions appeared' }
      )
      .toBe(true);

    await validOptions.first().click();

    // Verify the employee was selected.
    await expect(employeeName).not.toHaveValue('Ranga');

    // Select Enabled.
    await dropdowns.nth(1).click();
    await this.page.getByRole('option', { name: /^enabled$/i }).click();

    // Fill username and password.
    const form = this.page.locator('form').last();
    const textboxes = form.getByRole('textbox');
    const passwordInputs = form.locator('input[type="password"]');

    await textboxes.nth(1).fill(username);
    await passwordInputs.nth(0).fill('QaDemo!23456');
    await passwordInputs.nth(1).fill('QaDemo!23456');

    await expect(textboxes.nth(1)).toHaveValue(username);
    await expect(passwordInputs.nth(0)).toHaveValue('QaDemo!23456');
    await expect(passwordInputs.nth(1)).toHaveValue('QaDemo!23456');

    await this.page.getByRole('button', { name: /^save$/i }).click();

    // Wait for a success message or a validation error.
    const successMessage = this.page.getByText(
      /successfully saved|success/i
    ).first();

    const validationErrors = this.page.locator(
      '.oxd-input-field-error-message'
    );

    await expect
      .poll(
        async () => {
          if (await successMessage.isVisible().catch(() => false)) {
            return 'success';
          }

          const errors = await validationErrors.allTextContents();
          return errors.length > 0 ? errors.join(', ') : '';
        },
        { timeout: 15000, message: 'No save result appeared' }
      )
      .not.toBe('');

    const errors = await validationErrors.allTextContents();

    if (errors.length > 0) {
      throw new Error(`User creation validation failed: ${errors.join(', ')}`);
    }

    await expect(successMessage).toBeVisible();
  }

  async expectSuccessNotification(): Promise<void> {
    await expect(
      this.page.getByText(/successfully saved|success/i).first()
    ).toBeVisible({ timeout: 15000 });
  }
}
