/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global require, window*/
var template = require('./table.hbs');
var Marionette = require('marionette');
var MarionetteRegion = require('js/Marionette.Region');
var CustomElements = require('js/CustomElements');
var Common = require('js/Common');

function syncScrollbars(elementToUpdate, elementToMatch) {
    elementToUpdate.scrollLeft = elementToMatch.scrollLeft;
}

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('table'),
    template: template,
    regions: {
        bodyThead: {
            selector: '.table-body thead',
            replaceElement: true
        },
        bodyTbody: {
            selector: '.table-body tbody',
            replaceElement: true
        },
        headerThead: {
            selector: '.table-header thead',
            replaceElement: true
        },
        headerTbody: {
            selector: '.table-header tbody',
            replaceElement: true
        },
    },
    getHeaderView: function(){
        console.log('You need to overwrite this function and provide the constructed HeaderView');
    },
    getBodyView: function(){
        console.log('You need to overwrite this function and provide the constructed BodyView');
    },
    accountForScrollbar: function(){
        this.$el.find('.table-header')[0].style.width = 'calc(100% - '+Common.getScrollBarDimensions().width+'px)';
    },
    onRender: function() {
        this.headerTbody.show(this.getBodyView(), {
            replaceElement: true
        });
        this.headerThead.show(this.getHeaderView(), {
            replaceElement: true
        });
        this.bodyTbody.show(this.getBodyView(), {
            replaceElement: true
        });
        this.bodyThead.show(this.getHeaderView(), {
            replaceElement: true
        });
        this.accountForScrollbar();
        this.syncScrollbars();
    },
    syncScrollbars: function() {
        this.$el.find('.table-body').on('scroll', syncScrollbars.bind(this, this.$el.find('.table-header')[0], this.$el.find('.table-body')[0]));
    }
});