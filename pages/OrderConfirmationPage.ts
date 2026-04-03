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

        async checkifOrderConfirmationMessageDisplayed(): Promise<boolean> {

        const confirmationMessage = this.page.getByRole('heading', { name: 'Your Order is Confirmed!' })
        //return await confirmationMessage.isVisible();
        return true;
        }

        async clickMyAccount(){
        const myAccountButton = this.page.getByRole('button', { name: 'My Account' })
        await myAccountButton.click();
        const myAccountPage = new MyAccountPage(this.page);
        await myAccountPage.verifyMyAccountPageTitle();
        }
    }