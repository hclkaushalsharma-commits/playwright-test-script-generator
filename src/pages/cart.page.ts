import { expect, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  readonly items = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  async expectItems(names: string[]) {
    for (const name of names) {
      await expect(this.items.filter({ hasText: name })).toBeVisible();
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
