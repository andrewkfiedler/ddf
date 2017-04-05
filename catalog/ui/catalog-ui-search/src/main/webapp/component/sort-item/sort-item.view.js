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
/*global define*/
define([
    'marionette',
    'underscore',
    'jquery',
    './sort-item.hbs',
    'js/CustomElements',
    'component/singletons/metacard-definitions',
    'component/dropdown/dropdown.view',
    'component/property/property.view',
    'component/property/property',
    'properties'
], function (Marionette, _, $, template, CustomElements, metacardDefinitions, DropdownView, PropertyView, Property, properties) {

    var blacklist = ['anyText', 'anyGeo'];

    function getSortLabel(attribute) {
        var ascendingLabel, descendingLabel;
        if (metacardDefinitions.metacardTypes[attribute] === undefined) {
            ascendingLabel = descendingLabel = '';
        } else {
            switch (metacardDefinitions.metacardTypes[attribute].type) {
                case 'DATE':
                    ascendingLabel = 'Earliest';
                    descendingLabel = 'Latest';
                    break;
                case 'BOOLEAN':
                    ascendingLabel = 'True First'; //Truthiest
                    descendingLabel = 'False First'; //Falsiest
                    break;
                case 'LONG':
                case 'DOUBLE':
                case 'FLOAT':
                case 'INTEGER':
                case 'SHORT':
                    ascendingLabel = 'Smallest';
                    descendingLabel = 'Largest';
                    break;
                case 'STRING':
                    ascendingLabel = 'A to Z';
                    descendingLabel = 'Z to A';
                    break;
                case 'GEOMETRY':
                    ascendingLabel = 'Closest';
                    descendingLabel = 'Farthest';
                    break;
                case 'XML':
                case 'BINARY':
                default:
                    ascendingLabel = 'Ascending';
                    descendingLabel = 'Descending';
                    break;
            }
        }
        return {
            ascending: ascendingLabel,
            descending: descendingLabel
        };

    };

    function isDirectionalSort(attribute){
        return metacardDefinitions.metacardTypes[attribute] !== undefined;
    }

    function getSortAttributes(){
        return metacardDefinitions.sortedMetacardTypes.filter(function(type){
            return !properties.isHidden(type.id);
        }).filter(function(type){
            return !metacardDefinitions.isHiddenTypeExceptThumbnail(type.id);
        }).filter(function(type) {
            return blacklist.indexOf(type.id) === -1;
        }).map(function(metacardType) {
            return {
                label: metacardType.alias || metacardType.id,
                value: metacardType.id
            };
        });
    }

    return Marionette.LayoutView.extend({
        template: template,
        tagName: CustomElements.register('sort-item'),
        regions: {
            sortAttribute: '.sort-attribute',
            sortDirection: '.sort-direction'
        },
        events: {
            'click .sort-remove': 'removeModel'
        },
        initialize: function(options) {},
        removeModel: function() {
            this.model.destroy();
        },
        onBeforeShow: function() {
            var sortAttributes = getSortAttributes();

            if (this.options.showBestTextOption) {
                sortAttributes.unshift({
                    label: 'Best Text Match',
                    value: 'RELEVANCE'
                });
            }

            this.sortAttribute.show(new PropertyView({
                model: new Property({
                    enum: sortAttributes,
                    value: [this.model.get('attribute')],
                    id: 'Sort Attribute',
                    enumFiltering: true
                })
            }));
            this.setupSortDirection();
            this.turnOnEditing();
            this.turnOnLimitedWidth();

            this.sortAttribute.currentView.$el.on('change', function (event) {
                this.setupSortDirection();
            }.bind(this));
        },
        turnOffEditing: function () {
            this.sortAttribute.currentView.turnOffEditing();
            this.sortDirection.currentView.turnOffEditing();
        },
        turnOnEditing: function () {
            this.sortAttribute.currentView.turnOnEditing();
            this.handleSortDirectionEditing();
        },
        turnOnLimitedWidth: function () {
            this.sortAttribute.currentView.turnOnLimitedWidth();
            this.sortDirection.currentView.turnOnLimitedWidth();
        },
        setupSortDirection: function () {
            var attribute = this.sortAttribute.currentView.getCurrentValue()[0];
            var labels = getSortLabel(attribute);

            if (this.sortDirection.currentView){
                this.sortDirection.currentView.model.set('value', [this.model.get('direction')]);
                this.sortDirection.currentView.model.set('enum', [{
                    label: labels.ascending,
                    value: 'ascending'
                }, {
                    label: labels.descending,
                    value: 'descending'
                }]);
            } else {
                this.sortDirection.show(new PropertyView({
                    model: new Property({
                        enum: [{
                            label: labels.ascending,
                            value: 'ascending'
                        }, {
                            label: labels.descending,
                            value: 'descending'
                        }],
                        value: [this.model.get('direction')],
                        id: 'Sort Direction'
                    })
                }));
                this.turnOnLimitedWidth();
                this.listenToSortDirection();
            }

            this.handleSortDirectionEditing();
        },
        handleSortDirectionEditing: function(){
            var attribute = this.sortAttribute.currentView.getCurrentValue()[0];
            if (isDirectionalSort(attribute)) {
                this.sortDirection.currentView.turnOnEditing();
                this.$el.toggleClass('is-non-directional-sort', false);
            } else {
                this.sortDirection.currentView.turnOffEditing();
                this.$el.toggleClass('is-non-directional-sort', true);
            }
        },
        listenToSortDirection: function(){
            this.sortDirection.currentView.$el.on('change', function (event) {
                this.model.set('direction', this.sortDirection.currentView.getCurrentValue()[0]);
            }.bind(this));
        },
        getValue: function () {
            return {
                sortField: this.sortAttribute.currentView.getCurrentValue()[0],
                sortOrder: this.sortDirection.currentView.getCurrentValue()[0]
            }
        }
    });
});