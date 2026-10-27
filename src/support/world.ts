import { World, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class OrangeHrmWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  createdUsername = '';

  constructor(options: IWorldOptions) {
    super(options);
  }

  async launch(): Promise<void> {
    this.browser = await chromium.launch({
      headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false'
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(10_000);
  }

  async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(OrangeHrmWorld);
