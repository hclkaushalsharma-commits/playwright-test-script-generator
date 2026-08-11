import { Page } from '@playwright/test';
import { LoginPage } from './login.page.js';
import { InventoryPage } from './inventory.page.js';
import { CartPage } from './cart.page.js';
import { CheckoutPage } from './checkout.page.js';

export class SwagLabsApp {
  readonly login: LoginPage;
  readonly inventory: InventoryPage;
  readonly cart: CartPage;
  readonly checkout: CheckoutPage;

  constructor(page: Page) {
    this.login = new LoginPage(page);
    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }
}
