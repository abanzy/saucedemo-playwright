import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly title: Locator;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;

    constructor(private readonly page: Page) {
        this.title = page.getByText('Products', { exact: true });
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL('/inventory.html');
        await expect(this.title).toBeVisible();
        await expect(this.cartLink).toBeVisible();
    }

    async expectCartBadgeCount(count: number): Promise<void> {
        if (count === 0) {
            await expect(this.cartBadge).toHaveCount(0);
            return;
        }
        await expect(this.cartBadge).toBeVisible();
        await expect(this.cartBadge).toHaveText(String(count));
    }

    async addItemByName(name: string): Promise<void> {
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const addButton = this.page.locator(`[data-test="add-to-cart-${slug}"]`);
        const removeButton = this.page.locator(`[data-test="remove-${slug}"]`);
        await expect(addButton).toBeVisible();
        await expect(addButton).toBeEnabled();
        await addButton.click();
        await expect(removeButton).toBeVisible();
        await expect(addButton).toHaveCount(0);
    }

    async addSauceLabsBackpack(): Promise<void> {
        await this.addItemByName('Sauce Labs Backpack');
    }

    async openCart(): Promise<void> {
        await expect(this.cartLink).toBeVisible();
        await expect(this.cartLink).toBeEnabled();
        await this.cartLink.click();
    }
}
