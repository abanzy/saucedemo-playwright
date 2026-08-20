import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutStepTwoPage {
    readonly title: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;

    constructor(private readonly page: Page) {
        this.title = page.getByText('Checkout: Overview', { exact: true });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('/checkout-step-two.html');
        await expect(this.title).toBeVisible();
        await expect(this.finishButton).toBeVisible();
    }

    cartItemByName(name: string): Locator {
        return this.page.locator('.cart_item').filter({ hasText: name });
    }

    async expectItemCount(count: number): Promise<void> {
        await expect(this.page.locator('.cart_item')).toHaveCount(count);
    }

    async finish(): Promise<void> {
        await expect(this.finishButton).toBeVisible();
        await expect(this.finishButton).toBeEnabled();
        await this.finishButton.click();
    }
}
