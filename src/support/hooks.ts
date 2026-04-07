import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { CustomWorld } from './world';

setDefaultTimeout(60 * 1000); // 60 seconds
Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  this.context = await this.browser.newContext({
    viewport: null   
  });

  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});