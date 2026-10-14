describe('SmartWizard', () => {
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
        el = $('#smartwizard');
        el.smartWizard();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Default Options', () => {
        test('should add default class to the element', () => {
            expect(el.hasClass('sw')).toBeTruthy();
        });

        test('should add default theme to the element', () => {
            expect(el.hasClass('sw-theme-basic')).toBeTruthy();
        });

        test('should add toolbar elements', () => {
            expect(el.find('.sw-toolbar-bottom').length).toBe(1);
        });
    });

    describe('Initialization', () => {
        test('should initialize with custom options', () => {
            document.body.innerHTML = `
                <div id="smartwizard">
                    <ul class="sw-nav">
                        <li class="sw-nav-item"><a class="sw-nav-link" href="#step-1">Step 1</a></li>
                        <li class="sw-nav-item"><a class="sw-nav-link" href="#step-2">Step 2</a></li>
                    </ul>
                    <div class="sw-tab-content">
                        <div id="step-1" class="sw-tab-pane">Step 1 Content</div>
                        <div id="step-2" class="sw-tab-pane">Step 2 Content</div>
                    </div>
                </div>
            `;
            el = $('#smartwizard');
            el.smartWizard({
                initialStep: 1,
                theme: 'arrows',
                displayMode: 'dark',
                toolbar: {
                    position: 'both',
                    buttons: {
                        showNext: false,
                        showPrevious: false
                    }
                },
                navigation: {
                    alwaysClickable: true,
                    completed: {
                        enabled: true,
                        clickable: true
                    }
                }
            });

            expect(el.hasClass('sw-theme-arrows')).toBeTruthy();
            expect(el.attr('data-theme')).toBe('dark');
            expect(el.find('.sw-toolbar-top').length).toBe(1);
            expect(el.find('.sw-toolbar-bottom').length).toBe(1);
        });
    });

    describe('Navigation', () => {
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
            el = $('#smartwizard');
            el.smartWizard();
        });

        test('should navigate to next step when clicking next button', () => {
            el.smartWizard('next');
            expect(el.find('.sw-nav-link.active').parent().index()).toBe(1);
        });

        test('should navigate to previous step when clicking previous button', () => {
            el.smartWizard('next');
            el.smartWizard('prev');
            expect(el.find('.sw-nav-link.active').parent().index()).toBe(0);
        });
    });

    describe('State Management', () => {
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
            el = $('#smartwizard');
            el.smartWizard();
        });

        test('should disable steps correctly', () => {
            el.smartWizard('setState', [1], 'disable');
            expect(el.find('.sw-nav-link').eq(1).hasClass('disabled')).toBeTruthy();
        });

        test('should mark steps as completed correctly', () => {
            el.smartWizard('setState', [0], 'completed');
            expect(el.find('.sw-nav-link').eq(0).hasClass('completed')).toBeTruthy();
        });

        test('should handle error states correctly', () => {
            el.smartWizard('setState', [2], 'error');
            expect(el.find('.sw-nav-link').eq(2).hasClass('error')).toBeTruthy();
        });
    });
});
