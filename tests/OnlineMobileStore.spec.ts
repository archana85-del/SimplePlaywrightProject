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

    await page.goto(url);

    const onlineMobileStorePage = new OnlineMobileStorePage(page);
    await onlineMobileStorePage.clickImage();

    const ecommercePage = new EcommercePage(page);
    await ecommercePage.selectProduct(user.productName);

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.verifyProductPageTitle();
    await productDetailPage.verifyProductName(user.productName);
    await productDetailPage.clickAddToCart();

    const basketPage = new BasketPage(page);
    const isInCart = await basketPage.isProductInCart(user.productName);
    expect(isInCart).toBe(true);

    console.log(`Price of product in cart: ${await basketPage.getProductPrice(user.productName)}`);
    console.log(`Total price in cart: ${await basketPage.getTotalPrice()}`);

    await basketPage.clickContinue();

    const deliveryPage = new DeliveryPage(page);
    await deliveryPage.fillDeliveryForm(
      user.firstName,
      user.lastName,
      user.mobileNumber,
      user.emailAddress,
      user.shippingAddress,
      user.billingAddress
    );
    await deliveryPage.clickConfirmProceed();

    const paymentPage = new PaymentPage(page);
    await paymentPage.choosePaymentMethod(PaymentOption.GPay);
    await paymentPage.clickPayNow();

    const orderConfirmationPage = new OrderConfirmationPage(page);
    await orderConfirmationPage.checkifOrderConfirmationMessageDisplayed();
    await orderConfirmationPage.clickMyAccount();

    const myAccountPage = new MyAccountPage(page);
    const accountDetails = await myAccountPage.getAllAccountDetails();
    console.log('My Account Details:', accountDetails);

    console.log('-----------------------------------------');
  }
});