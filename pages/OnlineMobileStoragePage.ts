// pages/OnlineMobileStorePage.ts
import { Page, Locator } from '@playwright/test';
import { EcommercePage } from './EcommercePage';

export class OnlineMobileStorePage {
  private readonly page: Page;

  private readonly image: Locator;


  constructor(page: Page) {
    this.page = page;

    this.image = page.getByRole('img', { name: 'Online Mobile Store' })
    
  }

  async clickImage() {
    await this.image.first().click();
    //initialize new page Ecommerce 
    const ecommercePage = new EcommercePage(this.page); 
    ecommercePage.verifyTitle();
  }

 
}