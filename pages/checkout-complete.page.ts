import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeButton: Locator;

    constructor(private readonly page: Page) {
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.backHomeButton = page.getByRole('button', {
            name: 'Back Home',
        });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('/checkout-complete.html');
        await expect(this.completeHeader).toBeVisible();
        await expect(this.backHomeButton).toBeVisible();
    }

    async expectOrderConfirmed(): Promise<void> {
        await this.expectLoaded();
        await expect(this.completeHeader).toHaveText(
            'Thank you for your order!',
        );
        await expect(this.completeText).toBeVisible();
    }

    async backHome(): Promise<void> {
        await expect(this.backHomeButton).toBeVisible();
        await expect(this.backHomeButton).toBeEnabled();
        await this.backHomeButton.click();
    }
}
