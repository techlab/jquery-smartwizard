describe('SmartWizard', () => {
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
            expect(el.hasClass('sw-theme-default')).toBeTruthy();
        });

        test('should add toolbar elements', () => {
            expect(el.find('.toolbar-top').length).toBe(1);
            expect(el.find('.toolbar-bottom').length).toBe(1);
        });
    });

    describe('Initialization', () => {
        test('should initialize with custom options', () => {
            document.body.innerHTML = `
                <div id="smartwizard">
                    <ul class="nav">
                        <li><a href="#step-1">Step 1</a></li>
                        <li><a href="#step-2">Step 2</a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="step-1" class="tab-pane">Step 1 Content</div>
                        <div id="step-2" class="tab-pane">Step 2 Content</div>
                    </div>
                </div>
            `;
            el = $('#smartwizard');
            el.smartWizard({
                selected: 1,
                theme: 'arrows',
                justified: true,
                darkMode: true,
                autoAdjustHeight: false,
                cycleSteps: true,
                backButtonSupport: false,
                enableURLhash: false,
                transition: {
                    animation: 'slide-horizontal',
                    speed: '400'
                },
                toolbar: {
                    position: 'bottom',
                    showNextButton: false,
                    showPreviousButton: false
                },
                anchor: {
                    enableNavigationAlways: true,
                    enableDoneState: true,
                    doneClass: 'done',
                    enableDoneStateNavigation: true
                }
            });

            expect(el.hasClass('sw-theme-arrows')).toBeTruthy();
            expect(el.hasClass('sw-justified')).toBeTruthy();
            expect(el.hasClass('sw-dark')).toBeTruthy();
        });
    });

    describe('Navigation', () => {
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
            el = $('#smartwizard');
            el.smartWizard();
        });

        test('should navigate to next step when clicking next button', () => {
            el.smartWizard('next');
            expect(el.find('.nav-link.active').parent().index()).toBe(1);
        });

        test('should navigate to previous step when clicking previous button', () => {
            el.smartWizard('next');
            el.smartWizard('prev');
            expect(el.find('.nav-link.active').parent().index()).toBe(0);
        });
    });

    describe('State Management', () => {
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
            el = $('#smartwizard');
            el.smartWizard();
        });

        test('should disable steps correctly', () => {
            el.smartWizard('stepState', [1], 'disable');
            expect(el.find('.nav-link').eq(1).hasClass('disabled')).toBeTruthy();
        });

        test('should mark steps as done correctly', () => {
            el.smartWizard('stepState', [0], 'done');
            expect(el.find('.nav-link').eq(0).hasClass('done')).toBeTruthy();
        });

        test('should handle error states correctly', () => {
            el.smartWizard('stepState', [2], 'error');
            expect(el.find('.nav-link').eq(2).hasClass('error')).toBeTruthy();
        });
    });
});
