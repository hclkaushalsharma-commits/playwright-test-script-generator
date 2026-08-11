import { test, expect } from '@playwright/test';
import { SwagLabsApp } from '../src/pages/swag-labs.app.js';

const USER = process.env.SAUCE_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

test.describe('Swag Labs', () => {
  test('1 - valid login', async ({ page }) => {
    const app = new SwagLabsApp(page);
    await app.login.goto();
    await app.login.login(USER, PASSWORD);
    await app.inventory.expectLoaded();
    await expect(app.inventory.products.first()).toBeVisible();
  });

  test('2 - add Sauce Labs Backpack to cart', async ({ page }) => {
    const app = new SwagLabsApp(page);
    await app.login.goto();
    await app.login.login(USER, PASSWORD);
    await app.inventory.expectLoaded();
    await app.inventory.addProduct('Sauce Labs Backpack');
    await expect(app.inventory.cartBadge).toHaveText('1');
  });

  test('3 - cart contains two products', async ({ page }) => {
    const app = new SwagLabsApp(page);
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    await app.login.goto();
    await app.login.login(USER, PASSWORD);
    await app.inventory.expectLoaded();
    for (const product of products) await app.inventory.addProduct(product);
    await app.inventory.openCart();
    await app.cart.expectItems(products);
  });

  test('4 - checkout happy path', async ({ page }) => {
    const app = new SwagLabsApp(page);
    await app.login.goto();
    await app.login.login(USER, PASSWORD);
    await app.inventory.expectLoaded();
    await app.inventory.addProduct('Sauce Labs Backpack');
    await app.inventory.openCart();
    await app.cart.checkout();
    await app.checkout.fillCustomer('Kaushal', 'Sharma', '201301');
    await app.checkout.finishOrder();
    await app.checkout.expectConfirmation();
  });

  test('5 - locked-out user shows correct error', async ({ page }) => {
    const app = new SwagLabsApp(page);
    await app.login.goto();
    await app.login.login('locked_out_user', PASSWORD);
    await app.login.expectLoginError('Epic sadface: Sorry, this user has been locked out.');
  });
});
