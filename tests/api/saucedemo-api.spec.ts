import { expect, test, type Page } from '@playwright/test';

// Live request: GET /. Mocked routes: auth, products, and carts (SauceDemo has no commerce REST API).
// See docs/api-gaps.md.

async function mockJson(
    page: Page,
    urlPattern: string | RegExp,
    body: unknown,
    status = 200,
): Promise<void> {
    await page.route(urlPattern, async (route) => {
        await route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify(body),
        });
    });
}

async function fetchJson(
    page: Page,
    url: string,
    init?: RequestInit,
): Promise<{ status: number; body: unknown }> {
    return page.evaluate(
        async ({ url, init }) => {
            const res = await fetch(url, init);
            return { status: res.status, body: await res.json() };
        },
        { url, init },
    );
}

test.describe('API', () => {
    test('host responds on document root (live)', async ({ request }) => {
        const res = await request.get('/');
        expect(res.status()).toBe(200);
    });

    test('POST /auth/login returns a session payload (mocked)', async ({
        page,
    }) => {
        await mockJson(page, '**/auth/login', {
            id: 1,
            username: 'standard_user',
            token: 'mock-jwt-token',
        });
        await page.goto('/');

        const result = await fetchJson(page, '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'standard_user',
                password: 'secret_sauce',
            }),
        });

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
            username: 'standard_user',
            token: 'mock-jwt-token',
        });
    });

    test('GET /products returns a catalog (mocked)', async ({ page }) => {
        await mockJson(page, '**/products', [
            { id: 1, name: 'Sauce Labs Backpack', price: 29.99 },
            { id: 2, name: 'Sauce Labs Bike Light', price: 9.99 },
        ]);
        await page.goto('/');

        const result = await fetchJson(page, '/products');

        expect(result.status).toBe(200);
        expect(result.body).toEqual([
            { id: 1, name: 'Sauce Labs Backpack', price: 29.99 },
            { id: 2, name: 'Sauce Labs Bike Light', price: 9.99 },
        ]);
    });

    test('GET /carts returns cart lines (mocked)', async ({ page }) => {
        await mockJson(page, '**/carts', {
            id: 1,
            products: [{ id: 1, name: 'Sauce Labs Backpack', quantity: 1 }],
        });
        await page.goto('/');

        const result = await fetchJson(page, '/carts');

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
            id: 1,
            products: [{ id: 1, quantity: 1 }],
        });
    });
});
