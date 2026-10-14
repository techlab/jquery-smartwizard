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
        const toolbar = wizard.locator('.sw-toolbar').first();
        await expect(toolbar).toBeVisible();
    });

    test('should navigate through steps using next button', async ({ page }) => {
        // Get the next button (first element to avoid multi-match when toolbar: both)
        const nextBtn = page.locator('.sw-btn-next').first();

        // Check first step is active
        let activeStep = page.locator('.sw-nav .sw-nav-link.active');
        await expect(activeStep).toHaveAttribute('href', '#step-1');

        // Click next
        await nextBtn.click();
        await page.waitForTimeout(500); // Wait for transition

        // Check second step is active
        activeStep = page.locator('.sw-nav .sw-nav-link.active');
        await expect(activeStep).toHaveAttribute('href', '#step-2');

        // Click next again
        await nextBtn.click();
        await page.waitForTimeout(500);

        // Check third step is active
        activeStep = page.locator('.sw-nav .sw-nav-link.active');
        await expect(activeStep).toHaveAttribute('href', '#step-3');
    });

    test('should navigate using previous button', async ({ page }) => {
        const nextBtn = page.locator('.sw-btn-next').first();
        const prevBtn = page.locator('.sw-btn-prev').first();

        // Go to step 2
        await nextBtn.click();
        await page.waitForTimeout(500);

        // Go back to step 1
        await prevBtn.click();
        await page.waitForTimeout(500);

        // Verify we're on step 1
        const activeStep = page.locator('.sw-nav .sw-nav-link.active');
        await expect(activeStep).toHaveAttribute('href', '#step-1');
    });

    test('should navigate by clicking step anchors', async ({ page }) => {
        const nextBtn = page.locator('.sw-btn-next').first();

        // Navigate to step 2 so step 1 is marked as completed
        await nextBtn.click();
        await page.waitForTimeout(500);

        // Click on step 1 anchor (completed steps are clickable)
        await page.click('.sw-nav a[href="#step-1"]');
        await page.waitForTimeout(500);

        // Verify step 1 is active
        const activeStep = page.locator('.sw-nav .sw-nav-link.active');
        await expect(activeStep).toHaveAttribute('href', '#step-1');
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
        await page.locator('.sw-btn-next').first().click();
        await page.waitForTimeout(500);

        // Now step 2 should be visible
        await expect(step2Content).toBeVisible();

        // And step 1 should be hidden
        await expect(step1Content).not.toBeVisible();
    });
});
