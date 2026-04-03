import { Page, Locator, expect } from '@playwright/test';

export interface MyAccountDetails {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailId: string;
  billingAddress: string;
  shippingAddress: string;
  totalPrice: string;
}

export class MyAccountPage {
  private readonly page: Page;

  private readonly pageHeading: Locator;
  private readonly personalDetailsHeading: Locator;
  private readonly orderDetailsHeading: Locator;
  private readonly logoutButton: Locator;

  private readonly firstNameValue: Locator;
  private readonly lastNameValue: Locator;
  private readonly mobileNumberValue: Locator;
  private readonly emailIdValue: Locator;
  private readonly billingAddressValue: Locator;
  private readonly shippingAddressValue: Locator;
  private readonly totalPriceValue: Locator;
  private readonly cartItem: Locator;

  private readonly billingAddressChangeLink: Locator;
  private readonly shippingAddressChangeLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.getByRole('heading', { name: 'My Account' }).last();
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.orderDetailsHeading = page.getByRole('heading', { name: 'Order Details' });
    this.logoutButton = page.locator('#logout');

    // Using following-sibling text nodes/elements pattern by label text
    this.firstNameValue = page.locator('#firstName');
    this.lastNameValue = page.locator('#lastName');
    this.mobileNumberValue = page.locator('#mobileNumber');
    this.emailIdValue = page.locator('#email');

    this.billingAddressValue = page.locator('#billingAddress');
    this.shippingAddressValue = page.locator('#shippingAddress');
    this.totalPriceValue = page.locator('#totalPrice');
    this.cartItem = page.locator('#cartItems .cart-item');

    this.billingAddressChangeLink = page.locator("//button[@onclick='editAddress(\"billing\")']");
    this.shippingAddressChangeLink = page.locator("//button[@onclick='editAddress(\"shipping\")']");
  }

 
 async verifyMyAccountPageTitle() {  
    await expect(this.page).toHaveTitle('my-account');
  }

  private async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async getFirstName(): Promise<string> {
    return this.getText(this.firstNameValue);
  }

  async getLastName(): Promise<string> {
    return this.getText(this.lastNameValue);
  }

  async getMobileNumber(): Promise<string> {
    return this.getText(this.mobileNumberValue);
  }

  async getEmailId(): Promise<string> {
    return this.getText(this.emailIdValue);
  }

  async getBillingAddress(): Promise<string> {
    return this.getText(this.billingAddressValue);
  }

  async getShippingAddress(): Promise<string> {
    return this.getText(this.shippingAddressValue);
  }

  async getTotalPrice(): Promise<string> {
    return this.getText(this.totalPriceValue);
  }

  async getAllAccountDetails(): Promise<MyAccountDetails> {
    return {
      firstName: await this.getFirstName(),
      lastName: await this.getLastName(),
      mobileNumber: await this.getMobileNumber(),
      emailId: await this.getEmailId(),
      billingAddress: await this.getBillingAddress(),
      shippingAddress: await this.getShippingAddress(),
      totalPrice: await this.getTotalPrice(),
    };
  }

  async clickBillingAddressChange(): Promise<void> {
    await this.billingAddressChangeLink.click();
  }

  async clickShippingAddressChange(): Promise<void> {
    await this.shippingAddressChangeLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
