// jQuery is already globally available from setup.js

describe('SmartWizard Themes', () => {
    let el;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="smartwizard">
                <ul class="sw-nav">
                    <li class="sw-nav-item"><a class="sw-nav-link" href="#step-1">Step 1</a></li>
                    <li class="sw-nav-item"><a class="sw-nav-link" href="#step-2">Step 2</a></li>
                    <li class="sw-nav-item"><a class="sw-nav-link" href="#step-3">Step 3</a></li>
                </ul>
                <div class="sw-tab-content">
                    <div id="step-1" class="sw-tab-pane">Step 1 Content</div>
                    <div id="step-2" class="sw-tab-pane">Step 2 Content</div>
                    <div id="step-3" class="sw-tab-pane">Step 3 Content</div>
                </div>
            </div>
        `;
    });

    const themes = ['basic', 'arrows', 'glow', 'pills'];

    themes.forEach(theme => {
        describe(`${theme} Theme`, () => {
            beforeEach(() => {
                el = $('#smartwizard');
                el.smartWizard({
                    theme: theme
                });
            });

            test(`should apply sw-theme-${theme} class`, () => {
                expect(el.hasClass(`sw-theme-${theme}`)).toBeTruthy();
            });

            test('should have correct nav structure', () => {
                const nav = el.find('.sw-nav');
                expect(nav.length).toBe(1);
                expect(nav.find('.sw-nav-item').length).toBe(3);
                expect(nav.find('.sw-nav-link').length).toBe(3);
            });

            test('should handle step states correctly', () => {
                // Test active state with force=true
                el.smartWizard('goToStep', 1, true);
                expect(el.find('.sw-nav-link').eq(1).hasClass('active')).toBeTruthy();

                // Test completed state
                el.smartWizard('setState', [0], 'completed');
                expect(el.find('.sw-nav-link').eq(0).hasClass('completed')).toBeTruthy();

                // Test disabled state
                el.smartWizard('setState', [2], 'disable');
                expect(el.find('.sw-nav-link').eq(2).hasClass('disabled')).toBeTruthy();

                // Test error state
                el.smartWizard('setState', [2], 'error');
                expect(el.find('.sw-nav-link').eq(2).hasClass('error')).toBeTruthy();
            });
        });
    });

    describe('Display Mode / Theme switching', () => {
        test('should apply dark display mode via data-theme', () => {
            el = $('#smartwizard');
            el.smartWizard({
                theme: 'arrows',
                displayMode: 'dark'
            });
            expect(el.attr('data-theme')).toBe('dark');
        });

        test('should apply light display mode via data-theme', () => {
            el = $('#smartwizard');
            el.smartWizard({
                theme: 'basic',
                displayMode: 'light'
            });
            expect(el.attr('data-theme')).toBe('light');
        });
    });
});
