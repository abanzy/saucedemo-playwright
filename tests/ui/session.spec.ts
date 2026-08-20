import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { loginAsStandardUser, logoutIfPossible } from './auth';

test.describe('session', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page);
    });

    test.afterEach(async ({ page }) => {
        await logoutIfPossible(page);
    });

    test('inventory survives a page refresh after login', async ({ page }) => {
        const inventory = new InventoryPage(page);

        await inventory.expectLoaded();
        await page.reload();
        await inventory.expectLoaded();
    });

    test('cart item survives a page refresh', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.addItemByName('Sauce Labs Backpack');
        await inventory.expectCartBadgeCount(1);

        await page.reload();
        await inventory.expectLoaded();
        await inventory.expectCartBadgeCount(1);

        await inventory.openCart();
        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();
        await cart.expectItemCount(1);
    });

    test('multiple cart items survive a page refresh', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.addItemByName('Sauce Labs Backpack');
        await inventory.expectCartBadgeCount(1);
        await inventory.addItemByName('Sauce Labs Bike Light');
        await inventory.expectCartBadgeCount(2);

        await page.reload();
        await inventory.expectLoaded();
        await inventory.expectCartBadgeCount(2);

        await inventory.openCart();
        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();
        await expect(cart.cartItemByName('Sauce Labs Bike Light')).toBeVisible();
        await cart.expectItemCount(2);
    });

    test('session survives browser back from cart to inventory', async ({
        page,
    }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.openCart();
        await cart.expectLoaded();

        await page.goBack();
        await inventory.expectLoaded();
    });
});
