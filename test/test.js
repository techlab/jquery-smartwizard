describe('SmartWizard Default Options', function() {
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
    
    it('should add toolbar elements', function() {
        expect(el.children('.sw-toolbar')).toExist();
        expect(el.children('.sw-toolbar').children('.sw-btn-group').children('.sw-btn-next')).toExist();
        expect(el.children('.sw-toolbar').children('.sw-btn-group').children('.sw-btn-prev')).toExist();
    });
    
    it('should have step anchors', function() {
        expect(el.children('ul').children('li').children('a')).toExist();
    });
    
    it('should have step contents', function() {
        expect(el.children('div').children('div')).toExist();
    });
    
    it('should have step anchors step contents are equal numbers', function() {
        var a = el.children('ul').children('li').children('a');
        var c = el.children('div').children('div');
        expect(a.length).toBe(c.length);
    });
    
});

describe('SmartWizard Navigation', function() {
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
    
    it('should point to the first step', function() {
        expect(el.children('ul').children('li:first')).toHaveClass("active");
        expect(el.children('ul').children('li :not(:first)')).not.toHaveClass("active");
    });

});