describe('Plugin Default Init', function() {
    var el, plugin;

    beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'base/test';
        loadFixtures('test-template.html');

        el = $('#smartwizard');
        plugin = el.smartWizard();
    });
    
    afterEach(function(){
        el.remove();
        el = null;
    });
    
    it('should add default theme to the element', function() {
        expect(el).toHaveClass("sw-theme-default");
    });
});