import { After, Before, Status } from '@cucumber/cucumber';
import { OrangeHrmWorld } from './world';
import fs from 'node:fs';
import path from 'node:path';

Before(async function (this: OrangeHrmWorld) {
  await this.launch();
});

After(async function (this: OrangeHrmWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const directory = path.resolve('reports', 'screenshots');
    fs.mkdirSync(directory, { recursive: true });
    const safeName = scenario.pickle.name.replace(/[^a-z0-9-_]+/gi, '-').slice(0, 80);
    const screenshot = path.join(directory, `${Date.now()}-${safeName}.png`);
    await this.page.screenshot({ path: screenshot, fullPage: true }).catch(() => undefined);
    try {
  const screenshot = await this.page.screenshot({ fullPage: true });
  this.attach(screenshot, 'image/png');
} catch (error) {
  console.warn('Could not capture or attach failure screenshot:', error);
}
    this.log(`Failure screenshot saved to ${screenshot}`);
  }
  await this.close();
});
