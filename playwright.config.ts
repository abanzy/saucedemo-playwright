import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.example') });

process.env.BASE_URL ??= 'https://www.saucedemo.com';
process.env.USER_NAME ??= 'standard_user';
process.env.PASSWORD ??= 'secret_sauce';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? undefined : 2,
    reporter: [['list']],
    use: {
        baseURL: process.env.BASE_URL,
        headless: true,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off',
    },
    projects: [
        {
            name: 'ui-chromium',
            testMatch: '**/ui/**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'ui-firefox',
            testMatch: '**/ui/**/*.spec.ts',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'ui-webkit',
            testMatch: '**/ui/**/*.spec.ts',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'api',
            testMatch: '**/api/**/*.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
