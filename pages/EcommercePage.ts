// pages/EcommercePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { ProductDetailPage } from './ProductDetailPage';

export class EcommercePage {
  private readonly page: Page;



  constructor(page: Page) {
    this.page = page;
    
  }

  async selectProduct(productName: string) {
    const productLink = this.page.getByRole('link', { name: productName }).first();
    await productLink.click();
    const productDetailPage = new ProductDetailPage(this.page);
    await productDetailPage.verifyProductPageTitle();
    await productDetailPage.verifyProductName(productName);
  }
  

  async verifyTitle() {
     await expect(this.page).toHaveTitle('E-Commerce');
  }
};