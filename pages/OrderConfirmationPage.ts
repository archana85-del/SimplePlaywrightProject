import { Page, Locator, expect } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';



export class OrderConfirmationPage{

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

        async verifyOrderConfirmationPageTitle() {
        await expect(this.page).toHaveTitle('order-confirmation');
        }

        async checkifOrderConfirmationMessageDisplayed(){
            const confirmationMessage = await this.page.locator("div[class='container'] h1").textContent();
            expect(confirmationMessage).toBe('Your Order is Confirmed!');
        //const confirmationMessage = this.page.getByRole('heading', { name: 'Your Order is Confirmed!' })
        //return await confirmationMessage.isVisible();
        }

        async clickMyAccount(){
        const myAccountButton = this.page.getByRole('button', { name: 'My Account' })
        await myAccountButton.click();
        const myAccountPage = new MyAccountPage(this.page);
        await myAccountPage.verifyMyAccountPageTitle();
        }
    }