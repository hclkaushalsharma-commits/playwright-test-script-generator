import { expect, Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  readonly products = this.page.locator('[data-test="inventory-item"]');
  readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');

  product(name: string) {
    return this.products.filter({ hasText: name });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.products.first()).toBeVisible();
  }

  async addProduct(name: string) {
    const card = this.product(name);
    await expect(card).toBeVisible();
    await card.locator('[data-test^="add-to-cart"]').click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
