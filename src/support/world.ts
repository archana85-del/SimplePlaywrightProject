import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';

export type UserDetails = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  mobileNumber: string;
  shippingAddress: string;
  billingAddress: string;
  productName: string;
};

export type OrderResult = {
  fullName: string;
  productName: string;
  confirmed: boolean;
  accountDetails?: Record<string, string>;
};

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  csvData: UserDetails[] = [];
  orderResults: OrderResult[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);