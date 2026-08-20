import { expect, type Page } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page';
import { LoginPage } from '../../pages/login.page';

export function demoCredentials(): { username: string; password: string } {
    return {
        username: process.env.USER_NAME || 'standard_user',
        password: process.env.PASSWORD || 'secret_sauce',
    };
}

export async function loginAsStandardUser(page: Page): Promise<void> {
    const { username, password } = demoCredentials();
    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);
    await new InventoryPage(page).expectLoaded();
}

export async function logoutIfPossible(page: Page): Promise<void> {
    try {
        const menu = page.locator('#react-burger-menu-btn');
        if (!(await menu.isVisible({ timeout: 1500 }).catch(() => false))) {
            return;
        }
        await menu.click();
        const logout = page.locator('#logout_sidebar_link');
        await expect(logout).toBeVisible({ timeout: 2000 });
        await logout.click();
        await new LoginPage(page).expectLoaded();
    } catch {
        // Context is discarded after each test anyway.
    }
}
