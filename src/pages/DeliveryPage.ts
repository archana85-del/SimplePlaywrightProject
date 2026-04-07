
import { Page, Locator, expect } from '@playwright/test';
import { PaymentPage } from './PaymentPage';


export class DeliveryPage{

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

        async verifyDeliveryPageTitle() {
        await expect(this.page).toHaveTitle('delivery');

    }

    async fillDeliveryForm(firstName: string, lastName:string ,mobileNumber:string,
         email: string, billingAddress: string, shippingAddress: string) {
        await this.page.fill('#firstName', firstName);
        await this.page.fill('#lastName', lastName);
        await this.page.fill('#mobileNumber', mobileNumber);
        await this.page.fill('#email', email);
        await this.page.fill('#billingAddress', billingAddress);
        await this.page.fill('#shippingAddress', shippingAddress);
    }

    async clickConfirmProceed(){
        const clickConfirmProceed = this.page.getByRole('button', { name: 'Confirm & Proceed' })
        await clickConfirmProceed.click();
        const paymentPage = new PaymentPage(this.page);
        await paymentPage.verifyProductPageTitle();
    }
    

}