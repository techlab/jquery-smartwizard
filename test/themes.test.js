// jQuery is already globally available from setup.js

describe('SmartWizard Themes', () => {
    let el;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="smartwizard">
                <ul class="nav">
                    <li><a href="#step-1">Step 1</a></li>
                    <li><a href="#step-2">Step 2</a></li>
                    <li><a href="#step-3">Step 3</a></li>
                </ul>
                <div class="tab-content">
                    <div id="step-1" class="tab-pane">Step 1 Content</div>
                    <div id="step-2" class="tab-pane">Step 2 Content</div>
                    <div id="step-3" class="tab-pane">Step 3 Content</div>
                </div>
            </div>
        `;
    });

    describe('Dots Theme', () => {
        beforeEach(() => {
            el = $('#smartwizard');
            el.smartWizard({
                theme: 'dots'
            });
        });

        test('should apply dots theme class', () => {
            expect(el.hasClass('sw-theme-dots')).toBeTruthy();
        });

        test('should have correct nav structure', () => {
            const nav = el.find('.nav');
            expect(nav.length).toBe(1);
            expect(nav.hasClass('nav-tabs')).toBeTruthy();
        });

        test('should style nav links correctly', () => {
            const navLink = el.find('.nav-link').first();
            expect(navLink.css('position')).toBe('relative');
            expect(navLink.css('margin')).toBe('0 10px');
        });

        test('should handle step states correctly', () => {
            // Test active state
            el.smartWizard('goToStep', 1);
            expect(el.find('.nav-link').eq(1).hasClass('active')).toBeTruthy();

            // Test done state
            el.smartWizard('stepState', [0], 'done');
            expect(el.find('.nav-link').eq(0).hasClass('done')).toBeTruthy();

            // Test disabled state
            el.smartWizard('stepState', [2], 'disable');
            expect(el.find('.nav-link').eq(2).hasClass('disabled')).toBeTruthy();
        });

        test('should handle theme colors', () => {
            const root = document.documentElement;
            root.style.setProperty('--sw-primary-color', '#007bff');
            root.style.setProperty('--sw-success-color', '#28a745');

            const navLink = el.find('.nav-link').first();
            const computedStyle = window.getComputedStyle(navLink[0], ':before');

            // Test default state
            expect(computedStyle.backgroundColor).toBe('#ccc');

            // Test active state
            el.smartWizard('goToStep', 0);
            expect(computedStyle.backgroundColor).toBe('#007bff');

            // Test done state
            el.smartWizard('stepState', [0], 'done');
            expect(computedStyle.backgroundColor).toBe('#28a745');
        });

        test('should be responsive', () => {
            const nav = el.find('.nav');

            // Test desktop view
            window.innerWidth = 1024;
            window.dispatchEvent(new Event('resize'));
            expect(nav.css('justify-content')).toBe('center');

            // Test mobile view
            window.innerWidth = 480;
            window.dispatchEvent(new Event('resize'));
            expect(nav.css('flex-wrap')).toBe('wrap');
        });
    });
});