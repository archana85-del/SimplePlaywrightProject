
import { Page, Locator, expect } from '@playwright/test';
import { DeliveryPage } from './DeliveryPage';


export class BasketPage{

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    

     async verifyProductPageTitle() {
        await expect(this.page).toHaveTitle('basket');

    }

    // check if product is in cart
        async isProductInCart(productName: string): Promise<boolean>{
        const productLocator = this.page.locator(`td:has-text("${productName}")`);
        return await productLocator.count() > 0;
    }

    // get product price from cart
    async getProductPrice(productName: string): Promise<string> {
        const priceLocator = this.page.locator(`td:has-text("${productName}") + td`);
        return (await priceLocator.textContent()) ?? '';
    }

    //get total price from cart
    async getTotalPrice(): Promise<string> {
        const totalLocator = this.page.locator('#totalPrice');
        return (await totalLocator.textContent()) ?? '';
    }

    async clickContinue(){
        const continueButton = this.page.locator("#continueBtn")
        await continueButton.click();
        const deliveryPage = new DeliveryPage(this.page);
        await deliveryPage.verifyDeliveryPageTitle();
    }
    

}