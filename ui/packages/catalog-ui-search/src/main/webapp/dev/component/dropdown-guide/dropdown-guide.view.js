const BaseGuideView = require('dev/component/base-guide/base-guide.view');
const Marionette = require('marionette');
const template = require('./dropdown-guide.hbs');
const CustomElements = require('js/CustomElements');
const Backbone = require('backbone');
const exampleOne = require('./exampleOne.hbs');

module.exports = BaseGuideView.extend({
    templates: {
        exampleOne
    },
    styles: {

    },
    template: template,
    tagName: CustomElements.register('dev-dropdown-guide'),
    regions: {
        exampleOne: '.example:nth-of-type(1) .instance',
        exampleTwo: '.example:nth-of-type(2) .instance',
        exampleThree: '.example:nth-of-type(3) .instance',
        exampleFour: '.example:nth-of-type(4) .instance',
        exampleFive: '.example:nth-of-type(5) .instance'
    },
    showComponents() {
        this.showExampleOne();
        // this.showExampleTwo();
        // this.showExampleThree();
        // this.showExampleFour();
        // this.showExampleFive();
    },
    exampleOneView() {
        return Marionette.ItemView.extend({
            template: exampleOne,
            onRender() {
                setTimeout(() => {
                    this.render();
                }, 4000);
            },
            behaviors() {
                return {
                    dropdown: {
                        dropdowns: [{
                            selector: '> div > button:first-of-type',
                            view: this.constructor,
                            viewOptions: {
                                model: undefined
                            }
                        }]
                    }
                };
            }
        });
    },
    showExampleOne() {
        this.exampleOne.show(new(this.exampleOneView())());
    }
});