import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutStepOnePage {
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    constructor(private readonly page: Page) {
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.postalCode = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('/checkout-step-one.html');
        await expect(this.firstName).toBeVisible();
        await expect(this.lastName).toBeVisible();
        await expect(this.postalCode).toBeVisible();
        await expect(this.continueButton).toBeVisible();
    }

    async fillCustomerInfo(
        firstName: string,
        lastName: string,
        postalCode: string,
    ): Promise<void> {
        await expect(this.firstName).toBeVisible();
        await expect(this.lastName).toBeVisible();
        await expect(this.postalCode).toBeVisible();
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async continue(): Promise<void> {
        await expect(this.continueButton).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
        await this.continueButton.click();
    }

    async expectValidationError(message: string): Promise<void> {
        await this.expectLoaded();
        await expect(this.page).not.toHaveURL('/checkout-step-two.html');
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(message);
    }
}
