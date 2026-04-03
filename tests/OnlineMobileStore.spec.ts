import { test, expect } from '@playwright/test';
import { EcommercePage } from '../pages/EcommercePage';
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

dotenv.config({ path: './testdata/.env' });

type UserDetails = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber: string;
  shippingAddress: string;
  billingAddress: string;
  productName: string;
};

test('place orders for all rows from csv', async ({ page }) => {
  const csvData: UserDetails[] = parse(
    fs.readFileSync('./testdata/user_details.csv', 'utf-8'),
    {
      columns: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
      trim: true,
    }
  );

  const url = process.env.onlineMobileStoreUrl as string;

  for (const user of csvData) {
    console.log('Running test for:', user.firstName, user.lastName);
    console.log('Product:', user.productName);

    await test.step(`Open online mobile store for ${user.firstName} ${user.lastName}`, async () => {
      await page.goto(url);
    });

    const onlineMobileStorePage = new OnlineMobileStorePage(page);

    await test.step('Open e-commerce page from online mobile store', async () => {
      await onlineMobileStorePage.clickImage();
    });

    const ecommercePage = new EcommercePage(page);

    await test.step(`Select product: ${user.productName}`, async () => {
      await ecommercePage.selectProduct(user.productName);
    });

    const productDetailPage = new ProductDetailPage(page);

    await test.step('Verify product details page and add product to cart', async () => {
      await productDetailPage.verifyProductPageTitle();
      await productDetailPage.verifyProductName(user.productName);
      await productDetailPage.clickAddToCart();
    });

    const basketPage = new BasketPage(page);

    await test.step('Verify product in basket and review price details', async () => {
      const isInCart = await basketPage.isProductInCart(user.productName);
      expect(isInCart).toBe(true);

      console.log(`Price of product in cart: ${await basketPage.getProductPrice(user.productName)}`);
      console.log(`Total price in cart: ${await basketPage.getTotalPrice()}`);
    });

    await test.step('Continue from basket to delivery page', async () => {
      await basketPage.clickContinue();
    });

    const deliveryPage = new DeliveryPage(page);

    await test.step('Fill delivery form and proceed', async () => {
      await deliveryPage.fillDeliveryForm(
        user.firstName,
        user.lastName,
        user.mobileNumber,
        user.emailAddress,
        user.shippingAddress,
        user.billingAddress
      );
      await deliveryPage.clickConfirmProceed();
    });

    const paymentPage = new PaymentPage(page);

    await test.step('Choose payment method and complete payment', async () => {
      await paymentPage.choosePaymentMethod(PaymentOption.GPay);
      await paymentPage.clickPayNow();
    });

    const orderConfirmationPage = new OrderConfirmationPage(page);

    await test.step('Verify order confirmation and open My Account page', async () => {
      await orderConfirmationPage.checkifOrderConfirmationMessageDisplayed();
      await orderConfirmationPage.clickMyAccount();
    });

    const myAccountPage = new MyAccountPage(page);

    await test.step('Get and print My Account details', async () => {
      const accountDetails = await myAccountPage.getAllAccountDetails();
      console.log('My Account Details:', accountDetails);
    });

    await test.step('Logout from My Account', async () => {
      await myAccountPage.clickLogout();
    });

    console.log('-----------------------------------------');
  }
});