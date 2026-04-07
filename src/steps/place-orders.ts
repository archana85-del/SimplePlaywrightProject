import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { EcommercePage } from '../pages/EcommercePage'
import { OnlineMobileStorePage } from '../pages/OnlineMobileStoragePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { BasketPage } from '../pages/BasketPage';
import { DeliveryPage } from '../pages/DeliveryPage';
import { PaymentOption, PaymentPage } from '../pages/PaymentPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import * as dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { CustomWorld } from '../support/world';

dotenv.config({ path: './testdata/.env' });

Given('I load the user details from the csv file', async function (this: CustomWorld) {
  this.csvData = parse(
    fs.readFileSync('./testdata/user_details.csv', 'utf-8'),
    {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
      trim: true,
    }
  );

  this.orderResults = [];
});

When('I place orders for each user from the csv data', async function (this: CustomWorld) {
  const url = process.env.onlineMobileStoreUrl as string;

  for (const user of this.csvData) {
    console.log('Running test for:', user.firstName, user.lastName);
    console.log('Product:', user.productName);

    await this.page.goto(url);

    const onlineMobileStorePage = new OnlineMobileStorePage(this.page);
    await onlineMobileStorePage.clickImage();

    const ecommercePage = new EcommercePage(this.page);
    await ecommercePage.selectProduct(user.productName);

    const productDetailPage = new ProductDetailPage(this.page);
    await productDetailPage.verifyProductPageTitle();
    await productDetailPage.verifyProductName(user.productName);
    await productDetailPage.clickAddToCart();

    const basketPage = new BasketPage(this.page);
    const isInCart = await basketPage.isProductInCart(user.productName);
    expect(isInCart).toBe(true);

    console.log(`Price of product in cart: ${await basketPage.getProductPrice(user.productName)}`);
    console.log(`Total price in cart: ${await basketPage.getTotalPrice()}`);

    await basketPage.clickContinue();

    const deliveryPage = new DeliveryPage(this.page);
    await deliveryPage.fillDeliveryForm(
      user.firstName,
      user.lastName,
      user.mobileNumber,
      user.emailAddress,
      user.shippingAddress,
      user.billingAddress
    );
    await deliveryPage.clickConfirmProceed();

    const paymentPage = new PaymentPage(this.page);
    await paymentPage.choosePaymentMethod(PaymentOption.GPay);
    await paymentPage.clickPayNow();

    const orderConfirmationPage = new OrderConfirmationPage(this.page);
    await orderConfirmationPage.checkifOrderConfirmationMessageDisplayed();
    await orderConfirmationPage.clickMyAccount();

    const myAccountPage = new MyAccountPage(this.page);
    const accountDetails = await myAccountPage.getAllAccountDetails();
    console.log('My Account Details:', accountDetails);

    this.orderResults.push({
      fullName: `${user.firstName} ${user.lastName}`,
      productName: user.productName,
      confirmed: true
    });

    await myAccountPage.clickLogout();

    console.log('-----------------------------------------');
  }
});

Then('all orders should be placed successfully', async function (this: CustomWorld) {
  expect(this.csvData.length).toBeGreaterThan(0);
  expect(this.orderResults.length).toBe(this.csvData.length);

  for (const result of this.orderResults) {
    expect(result.confirmed).toBe(true);
    console.log(`Order placed successfully for ${result.fullName} - ${result.productName}`);
  }
});