import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
    readonly title: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(private readonly page: Page) {
        this.title = page.getByText('Your Cart', { exact: true });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', {
            name: 'Continue Shopping',
        });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('/cart.html');
        await expect(this.title).toBeVisible();
        await expect(this.checkoutButton).toBeVisible();
    }

    async checkout(): Promise<void> {
        await expect(this.checkoutButton).toBeVisible();
        await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click();
    }

    cartItemByName(name: string): Locator {
        return this.page.locator('.cart_item').filter({ hasText: name });
    }

    async removeItemByName(name: string): Promise<void> {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const removeButton = this.page.locator(`[data-test="remove-${slug}"]`);
        await expect(removeButton).toBeVisible();
        await expect(removeButton).toBeEnabled();
        await removeButton.click();
        await expect(removeButton).toHaveCount(0);
    }

    async expectItemCount(count: number): Promise<void> {
        await expect(this.page.locator('.cart_item')).toHaveCount(count);
    }
}
