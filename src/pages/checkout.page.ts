import { expect, Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  readonly firstName = this.page.locator('[data-test="firstName"]');
  readonly lastName = this.page.locator('[data-test="lastName"]');
  readonly postalCode = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly confirmation = this.page.locator('[data-test="complete-header"]');

  async fillCustomer(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectConfirmation() {
    await expect(this.confirmation).toHaveText('Thank you for your order!');
  }
}
