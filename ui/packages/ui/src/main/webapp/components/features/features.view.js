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
/*global define, window, setTimeout*/
define([
    'marionette',
    'text!./features.hbs',
    'js/CustomElements',
    'components/feature-item/feature-item.collection.view'
    ],function (Marionette, template, CustomElements, FeatureItemCollectionView) {

    return Marionette.Layout.extend({
        tagName: CustomElements.register('features'),
        template: template,
        regions: {
            collectionRegion: '.features'
        },
        events: {
            'change > .features-header select': 'updateFiltering',
            'keyup > .features-header input': 'updateFiltering'
        },
        updateFiltering: function() {
            this.collectionRegion.currentView.updateFilter({
                status: this.$el.find('> .features-header select').val(),
                name: this.$el.find('> .features-header input').val()
            });
        },
        initialize: function(options) {
        },
        onRender: function() {
            this.collectionRegion.show(new FeatureItemCollectionView({
                collection: this.options.collection,
                showWarnings: this.options.showWarnings,
                filter: {
                    status: this.$el.find('> .features-header select').val(),
                    name: this.$el.find('> .features-header input').val()
                }
            }));
        },
        focus: function() {
            this.$el.find('> .features-header input').focus();
        }
    });

});