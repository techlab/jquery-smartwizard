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
        expect(el).toHaveClass("sw-theme-default");
    });

    it('should add toolbar elements', function() {
        expect(el.find('.toolbar')).toExist();
        expect(el.find('.toolbar').find('.sw-btn-next')).toExist();
        expect(el.find('.toolbar').find('.sw-btn-prev')).toExist();
    });

});

describe('SmartWizard Navigation', function() {
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

    it('should show the first step', function() {
        expect(el.find('.nav').find('.nav-link').first()).toHaveClass("active");
    });

    it('should not show other steps', function() {
        expect(el.find('.nav').find('.nav-link:not(:first)')).not.toHaveClass("active");
    });

});
