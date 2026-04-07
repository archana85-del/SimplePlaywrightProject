import { Page, Locator, expect } from "@playwright/test";
import { BasketPage } from "./BasketPage";

export class ProductDetailPage {

private  page: Page;

private readonly productDescription: Locator;
private readonly addToCartButton: Locator;

//create page object for https://senthilsmartqahub.blogspot.com/2026/02/product.html#0
    constructor(page: Page) {
        this.page = page;
        
        this.productDescription = page.getByRole('paragraph', { name: 'Product Description' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    }

    async verifyProductPageTitle() {
        await expect(this.page).toHaveTitle('product');
    }

    async verifyProductName(productName:string) {
      
        const productTitle = this.page.getByRole('heading', { name: productName });
        await expect(productTitle).toBeVisible();

    }    
    
    async clickAddToCart() {
        await this.addToCartButton.click();
        await this.page.waitForTimeout(3000); // wait for cart update
        const basketPage = new BasketPage(this.page);
        basketPage.verifyProductPageTitle();
        
    }

}
