const Marionette = require('marionette');
import React from 'react';
import {
    render
} from 'react-dom';
import AceEditor from 'react-ace';
import 'brace/mode/html';
import 'brace/mode/less';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow_night';
const beautify = require('js-beautify');

const renderAce = ({
    where,
    mode,
    value
}) => {
    render( <
        AceEditor mode = {
            mode
        }
        theme = "tomorrow_night"
        value = {
            value
        }
        readOnly height = '200px'
        maxLines = { Infinity }
        wrapEnabled = {true}
        width = '100%' /
        > , where
    )
}

module.exports = Marionette.LayoutView.extend({
    onBeforeShow() {
        this.showComponents();
        this.showEditors();
    },
    styles: {

    },
    showComponents() {
        //override
    },
    showEditors() {
        this.$el.find('.editor[data-html]').each((index, element) => {
            const instanceHTML = element.parentNode.querySelector('.instance').innerHTML;
            renderAce({
                where: element,
                mode: 'html',
                value: beautify.html_beautify(instanceHTML, {
                    unformatted: ['']
                })
            });
        });
        this.$el.find('.editor[data-css]').each((index, element) => {
            const instanceCSS = this.styles[element.getAttribute('data-css')];
            renderAce({
                where: element,
                mode: 'less',
                value: beautify.css_beautify(instanceCSS)
            });
        });
        this.$el.find('.editor[data-js]').each((index, element) => {
            const instanceJS = this[element.getAttribute('data-js')].toString();
            renderAce({
                where: element,
                mode: 'javascript',
                value: beautify(instanceJS.slice(instanceJS.indexOf('{') + 1, instanceJS.lastIndexOf('}')))
            });
        });
    }
});