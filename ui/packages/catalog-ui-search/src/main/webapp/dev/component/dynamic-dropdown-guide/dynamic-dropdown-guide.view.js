const BaseGuideView = require('dev/component/base-guide/base-guide.view');
const Marionette = require('marionette');
const template = require('./dynamic-dropdown-guide.hbs');
const CustomElements = require('js/CustomElements');
const Backbone = require('backbone');

module.exports = BaseGuideView.extend({
    templates: {
    },
    styles: {

    },
    template: template,
    tagName: CustomElements.register('dev-dynamic-dropdown-guide'),
    regions: {
        exampleOne: '.example:nth-of-type(1) .instance',
        exampleTwo: '.example:nth-of-type(2) .instance',
        exampleThree: '.example:nth-of-type(3) .instance',
        exampleFour: '.example:nth-of-type(4) .instance',
        exampleFive: '.example:nth-of-type(5) .instance'
    },
    showComponents() {
        // this.showExampleOne();
        // this.showExampleTwo();
        // this.showExampleThree();
        // this.showExampleFour();
        // this.showExampleFive();
    }
});