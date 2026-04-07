import { Page, expect } from '@playwright/test';

export enum PaymentOption {
  CashOnDelivery = 'Cash on Delivery',
  CreditCard = 'Credit Card',
  DebitCard = 'Debit Card',
  PhonePe = 'Phone Pe',
  GPay = 'GPay'
}

export class PaymentPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async verifyProductPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/payment/i);
  }

  async choosePaymentMethod(paymentOption: PaymentOption = PaymentOption.CreditCard
  ): Promise<void> {
    const paymentOptionLocator = this.page.locator(
      `input[value='${paymentOption}']`
    );

    if ((await paymentOptionLocator.count()) > 0) {
      await paymentOptionLocator.check();
    } else {
      await this.page
        .locator(`input[value='${PaymentOption.CreditCard}']`)
        .check();
    }
  }

  async clickPayNow(): Promise<void> {
    await this.page.getByRole('button', { name: 'Pay / Confirm' }).click();
  }

  async getSelectedPaymentMethod(): Promise<string> {
    const checkedOption = this.page.locator('input[type="radio"]:checked');
    return (await checkedOption.getAttribute('value')) ?? '';
  }
}