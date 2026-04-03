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
dotenv.config({path:'./testdata/.env'});

test('has title', async ({ page }) => {
  const productName = 'Samsung Galaxy S24';
  //await page.goto('https://senthilsmartqahub.blogspot.com/2026/03/online-mobile-store.html');
  
    console.log("Online Mobile Store URL from .env file: " + process.env.onlineMobileStoreUrl);
    const url = process.env.onlineMobileStoreUrl as string;
  await page.goto(url);
   const onlineMobileStorePage = new OnlineMobileStorePage(page); 
  await onlineMobileStorePage.clickImage();

const ecommercePage = new EcommercePage(page);
  await ecommercePage.selectProduct(productName);

  const productDetailPage = new ProductDetailPage(page);
  await productDetailPage.verifyProductPageTitle();
  await productDetailPage.verifyProductName(productName);
  await productDetailPage.clickAddToCart();

  const basketPage = new BasketPage(page);
  const isInCart = await basketPage.isProductInCart(productName);
  expect(isInCart).toBe(true);
  console.log(`Price of product in cart: ${await basketPage.getProductPrice(productName)}`);
  console.log(`Total price in cart: ${await basketPage.getTotalPrice()}`);
 await basketPage.clickContinue();

  const deliveryPage = new DeliveryPage(page);
  await deliveryPage.fillDeliveryForm('John', 'Doe', '1234567890', 'john.doe@example.com', '123 Main St', '456 Oak Ave');
  await deliveryPage.clickConfirmProceed();

  const paymentPage = new PaymentPage(page);
  await paymentPage.choosePaymentMethod(PaymentOption.GPay);
  await paymentPage.clickPayNow();

  const orderConfirmationPage = new OrderConfirmationPage(page);
  await orderConfirmationPage.checkifOrderConfirmationMessageDisplayed();
  
  orderConfirmationPage.clickMyAccount();

const myAccountPage = new MyAccountPage(page);
console.log(await myAccountPage.getAllAccountDetails());




});
