import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { InventoryPage } from '../../pages/inventory.page';
import { loginAsStandardUser, logoutIfPossible } from './auth';

test.describe('cart', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page);
    });

    test.afterEach(async ({ page }) => {
        await logoutIfPossible(page);
    });

    test('add item and validate cart contents', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.addItemByName('Sauce Labs Backpack');
        await inventory.expectCartBadgeCount(1);
        await inventory.openCart();

        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();
        await cart.expectItemCount(1);
    });

    test('multiple items appear in the cart', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.addItemByName('Sauce Labs Backpack');
        await inventory.expectCartBadgeCount(1);
        await inventory.addItemByName('Sauce Labs Bike Light');
        await inventory.expectCartBadgeCount(2);
        await inventory.openCart();

        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();
        await expect(cart.cartItemByName('Sauce Labs Bike Light')).toBeVisible();
        await cart.expectItemCount(2);
    });

    test('remove item from cart before checkout', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);

        await inventory.addItemByName('Sauce Labs Backpack');
        await inventory.expectCartBadgeCount(1);
        await inventory.openCart();
        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();

        await cart.removeItemByName('Sauce Labs Backpack');
        await cart.expectItemCount(0);
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toHaveCount(0);
    });
});
