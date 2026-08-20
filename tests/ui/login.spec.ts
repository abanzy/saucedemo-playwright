import { expect, test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';
import { demoCredentials, logoutIfPossible } from './auth';

test.describe('login', () => {
    test.afterEach(async ({ page }) => {
        await logoutIfPossible(page);
    });

    test('successful login shows the products page', async ({ page }) => {
        const { username, password } = demoCredentials();
        const login = new LoginPage(page);

        await login.goto();
        await login.login(username, password);

        await new InventoryPage(page).expectLoaded();
    });

    test('invalid login credentials are rejected', async ({ page }) => {
        const { username } = demoCredentials();
        const login = new LoginPage(page);

        await login.goto();
        await login.login(username, 'wrong_password');

        await login.expectLoaded();
        await expect(page).not.toHaveURL('/inventory.html');
        await expect(login.errorMessage).toBeVisible();
        await expect(login.errorMessage).toContainText(
            'Username and password do not match',
        );
    });

    test('locked-out user cannot log in', async ({ page }) => {
        const { password } = demoCredentials();
        const login = new LoginPage(page);

        await login.goto();
        await login.login('locked_out_user', password);

        await login.expectLoaded();
        await expect(page).not.toHaveURL('/inventory.html');
        await expect(login.errorMessage).toBeVisible();
        await expect(login.errorMessage).toContainText('locked out');
    });
});
