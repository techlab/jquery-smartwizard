import { test, expect } from '@playwright/test';

test.describe('SmartWizard E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to your examples page
        await page.goto('http://localhost:3001/examples/index.html');

        // Wait for the wizard to be initialized
        await page.waitForSelector('#smartwizard');
    });

    test('should initialize wizard with correct structure', async ({ page }) => {
        // Check if wizard element exists
        const wizard = page.locator('#smartwizard');
        await expect(wizard).toBeVisible();

        // Check if it has the correct class
        await expect(wizard).toHaveClass(/sw/);

        // Check if navigation exists
        const nav = wizard.locator('.sw-nav');
        await expect(nav).toBeVisible();

        // Check if toolbar exists
        const toolbar = wizard.locator('.sw-toolbar');
        await expect(toolbar).toBeVisible();
    });

    test('should navigate through steps using next button', async ({ page }) => {
        // Get the next button
        const nextBtn = page.locator('.sw-btn-next');

        // Check first step is active
        let activeStep = page.locator('.sw-nav .nav-link.active');
        await expect(activeStep).toContainText('Step 1');

        // Click next
        await nextBtn.click();
        await page.waitForTimeout(500); // Wait for transition

        // Check second step is active
        activeStep = page.locator('.sw-nav .nav-link.active');
        await expect(activeStep).toContainText('Step 2');

        // Click next again
        await nextBtn.click();
        await page.waitForTimeout(500);

        // Check third step is active
        activeStep = page.locator('.sw-nav .nav-link.active');
        await expect(activeStep).toContainText('Step 3');
    });

    test('should navigate using previous button', async ({ page }) => {
        const nextBtn = page.locator('.sw-btn-next');
        const prevBtn = page.locator('.sw-btn-prev');

        // Go to step 2
        await nextBtn.click();
        await page.waitForTimeout(500);

        // Go back to step 1
        await prevBtn.click();
        await page.waitForTimeout(500);

        // Verify we're on step 1
        const activeStep = page.locator('.sw-nav .nav-link.active');
        await expect(activeStep).toContainText('Step 1');
    });

    test('should navigate by clicking step anchors', async ({ page }) => {
        // Click on step 3 directly
        await page.click('.sw-nav a[href="#step-3"]');
        await page.waitForTimeout(500);

        // Verify step 3 is active
        const activeStep = page.locator('.sw-nav .nav-link.active');
        await expect(activeStep).toContainText('Step 3');
    });

    test('should apply theme class correctly', async ({ page }) => {
        const wizard = page.locator('#smartwizard');

        // Check if a theme class is applied
        const hasTheme = await wizard.evaluate((el) => {
            return Array.from(el.classList).some(cls => cls.startsWith('sw-theme-'));
        });

        expect(hasTheme).toBeTruthy();
    });

    test('should show/hide content panels correctly', async ({ page }) => {
        // Check step 1 content is visible
        const step1Content = page.locator('#step-1');
        await expect(step1Content).toBeVisible();

        // Check step 2 content is hidden
        const step2Content = page.locator('#step-2');
        await expect(step2Content).not.toBeVisible();

        // Navigate to step 2
        await page.click('.sw-btn-next');
        await page.waitForTimeout(500);

        // Now step 2 should be visible
        await expect(step2Content).toBeVisible();

        // And step 1 should be hidden
        await expect(step1Content).not.toBeVisible();
    });
});
