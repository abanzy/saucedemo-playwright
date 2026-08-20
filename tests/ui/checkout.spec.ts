import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page';
import { CheckoutStepOnePage } from '../../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../../pages/checkout-step-two.page';
import { InventoryPage } from '../../pages/inventory.page';
import { loginAsStandardUser, logoutIfPossible } from './auth';

const missingFieldCases = [
    {
        name: 'First Name',
        fill: { firstName: '', lastName: 'Doe', postalCode: '90210' },
        error: 'Error: First Name is required',
    },
    {
        name: 'Last Name',
        fill: { firstName: 'Jane', lastName: '', postalCode: '90210' },
        error: 'Error: Last Name is required',
    },
    {
        name: 'Postal Code',
        fill: { firstName: 'Jane', lastName: 'Doe', postalCode: '' },
        error: 'Error: Postal Code is required',
    },
] as const;

// Known demo defect: whitespace-only required fields are accepted.
// Per ISTQB, this should fail in a production environment.
const whitespaceOnlyFieldCases = [
    {
        name: 'First Name',
        fill: { firstName: '   ', lastName: 'Doe', postalCode: '90210' },
    },
    {
        name: 'Last Name',
        fill: { firstName: 'Jane', lastName: '   ', postalCode: '90210' },
    },
    {
        name: 'Postal Code',
        fill: { firstName: 'Jane', lastName: 'Doe', postalCode: '   ' },
    },
] as const;

test.describe('checkout', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStandardUser(page);
    });

    test.afterEach(async ({ page }) => {
        await logoutIfPossible(page);
    });

    test('completes order and shows confirmation', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);
        const checkoutStepOne = new CheckoutStepOnePage(page);
        const checkoutStepTwo = new CheckoutStepTwoPage(page);
        const checkoutComplete = new CheckoutCompletePage(page);

        await inventory.addSauceLabsBackpack();
        await inventory.expectCartBadgeCount(1);
        await inventory.openCart();

        await cart.expectLoaded();
        await expect(cart.cartItemByName('Sauce Labs Backpack')).toBeVisible();
        await cart.expectItemCount(1);
        await cart.checkout();

        await checkoutStepOne.expectLoaded();
        await checkoutStepOne.fillCustomerInfo('Jane', 'Doe', '90210');
        await checkoutStepOne.continue();

        await checkoutStepTwo.expectLoaded();
        await expect(
            checkoutStepTwo.cartItemByName('Sauce Labs Backpack'),
        ).toBeVisible();
        await checkoutStepTwo.expectItemCount(1);
        await checkoutStepTwo.finish();

        await checkoutComplete.expectOrderConfirmed();
    });

    for (const scenario of missingFieldCases) {
        test(`stays on step one when ${scenario.name} is blank`, async ({
            page,
        }) => {
            const inventory = new InventoryPage(page);
            const cart = new CartPage(page);
            const checkoutStepOne = new CheckoutStepOnePage(page);

            await inventory.addSauceLabsBackpack();
            await inventory.expectCartBadgeCount(1);
            await inventory.openCart();
            await cart.expectLoaded();
            await cart.expectItemCount(1);
            await cart.checkout();

            await checkoutStepOne.expectLoaded();
            await checkoutStepOne.fillCustomerInfo(
                scenario.fill.firstName,
                scenario.fill.lastName,
                scenario.fill.postalCode,
            );
            await checkoutStepOne.continue();

            await checkoutStepOne.expectValidationError(scenario.error);
        });
    }

    for (const scenario of whitespaceOnlyFieldCases) {
        test(`accepts whitespace-only ${scenario.name} on live demo`, async ({
            page,
        }) => {
            const inventory = new InventoryPage(page);
            const cart = new CartPage(page);
            const checkoutStepOne = new CheckoutStepOnePage(page);
            const checkoutStepTwo = new CheckoutStepTwoPage(page);

            await inventory.addSauceLabsBackpack();
            await inventory.expectCartBadgeCount(1);
            await inventory.openCart();
            await cart.expectLoaded();
            await cart.checkout();

            await checkoutStepOne.expectLoaded();
            await checkoutStepOne.fillCustomerInfo(
                scenario.fill.firstName,
                scenario.fill.lastName,
                scenario.fill.postalCode,
            );
            await checkoutStepOne.continue();

            await checkoutStepTwo.expectLoaded();
            await expect(
                checkoutStepTwo.cartItemByName('Sauce Labs Backpack'),
            ).toBeVisible();
        });
    }

    // Known demo defect: an empty cart can complete checkout.
    // Per ISTQB, this should fail in a production environment.
    test('completes checkout with zero cart items', async ({ page }) => {
        const inventory = new InventoryPage(page);
        const cart = new CartPage(page);
        const checkoutStepOne = new CheckoutStepOnePage(page);
        const checkoutStepTwo = new CheckoutStepTwoPage(page);
        const checkoutComplete = new CheckoutCompletePage(page);

        await inventory.expectCartBadgeCount(0);
        await inventory.openCart();

        await cart.expectLoaded();
        await cart.expectItemCount(0);
        await cart.checkout();

        await checkoutStepOne.expectLoaded();
        await checkoutStepOne.fillCustomerInfo('Empty', 'Cart', '00000');
        await checkoutStepOne.continue();

        await checkoutStepTwo.expectLoaded();
        await checkoutStepTwo.expectItemCount(0);
        await checkoutStepTwo.finish();

        await checkoutComplete.expectOrderConfirmed();
    });
});
