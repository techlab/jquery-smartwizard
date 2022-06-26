describe('SmartWizard Default Options', function() {
    var el;

    beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'base/test';
        loadFixtures('test-template.html');

        el = $('#smartwizard');
        el.smartWizard();
    });

    afterEach(function(){
        el.remove();
        el = null;
    });

    it('should add default class to the element', function() {
        expect(el).toHaveClass("sw");
    });

    it('should add default theme to the element', function() {
        expect(el).toHaveClass("sw-theme-basic");
    });

    it('should add toolbar elements', function() {
        expect(el.find('.toolbar')).toExist();
        expect(el.find('.toolbar').find('.sw-btn-next')).toExist();
        expect(el.find('.toolbar').find('.sw-btn-prev')).toExist();
    });

});

describe('SmartWizard widget', () => {
    it('should trigger "initialized" event', () => {
        jasmine.getFixtures().fixturesPath = 'base/test';
        loadFixtures('test-template.html');

        var loadedEventSpy = jasmine.createSpy("initialized");
        var el = $('#smartwizard');

        $(el).on("initialized", loadedEventSpy);

        expect(loadedEventSpy).not.toHaveBeenCalled();

        el.smartWizard();

        expect(loadedEventSpy).toHaveBeenCalled();
	});
});
