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
/*global define, alert*/
define([
    'marionette',
    'underscore',
    'jquery',
    'js/CustomElements',
    './property.view',
    './property.collection',
    'properties',
    'component/singletons/metacard-definitions',
    'component/announcement',
    'js/Common'
], function(Marionette, _, $, CustomElements, PropertyView, PropertyCollection, properties, metacardDefinitions,
        announcement, Common) {

    return Marionette.CollectionView.extend({
        tagName: CustomElements.register('property-collection'),
        childView: PropertyView,
        addProperties: function(attributes){
            var newAttributes = attributes.filter((attribute) => !this.collection.get(attribute));
            if (newAttributes.length > 0) {
                this.collection.add(newAttributes.map((attribute) => {
                    return {
                        enumFiltering: true,
                        enum: metacardDefinitions.enums[attribute],
                        validation: metacardDefinitions.validation[attribute],
                        label: properties.attributeAliases[attribute],
                        readOnly: properties.isReadOnly(attribute),
                        id: attribute,
                        type: metacardDefinitions.metacardTypes[attribute].type,
                        values: {},
                        initializeToDefault: true,
                        multivalued: metacardDefinitions.metacardTypes[attribute].multivalued
                    };
                }));
                this.children.findByModel(this.collection.get(newAttributes[0])).el.scrollIntoViewIfNeeded();
            }
            return newAttributes;
        },
        removeProperties: function(attributes){
            this.collection.remove(attributes);
        },
        turnOnLimitedWidth: function() {
            this.children.forEach(function(childView) {
                childView.turnOnLimitedWidth();
            });
        },
        turnOnEditing: function() {
            this.children.forEach(function(childView) {
                childView.turnOnEditing();
            });
        },
        turnOffEditing: function() {
            this.children.forEach(function(childView) {
                childView.turnOffEditing();
            });
        },
        revert: function() {
            this.children.forEach(function(childView) {
                if (childView.hasChanged()) {
                    childView.revert();
                }
            });
        },
        save: function() {
            this.children.forEach(function(childView) {
                childView.save();
            });
        },
        toJSON: function() {
            return this.children.reduce(function(attributeToVal, childView) {
                return _.extend(attributeToVal, childView.toJSON());
            }, {});
        },
        toPatchJSON: function(addedAttributes, removedAttributes) {
            var attributeArray = [];
            this.children.forEach(function(childView) {
                var isNew = addedAttributes.indexOf(childView.model.id) >= 0;
                var attribute = isNew ? childView.toJSON() : childView.toPatchJSON();
                if (attribute) {
                    attributeArray.push(attribute);
                }
            });
            removedAttributes.forEach(function(attribute){
                attributeArray.push({
                    attribute: attribute,
                    values: []
                });
            });
            return attributeArray;
        },
        clearValidation: function() {
            this.children.forEach(function(childView) {
                childView.clearValidation();
            });
        },
        updateValidation: function(validationReport) {
            var self = this;
            validationReport.forEach(function(attributeValidationReport) {
                self.children.filter(function(childView) {
                    return childView.model.get('id') === attributeValidationReport.attribute;
                }).forEach(function(childView) {
                    childView.updateValidation(attributeValidationReport);
                });
            });
        },
        focus: function() {
            this.children.first().focus();
        }
    }, {
        //contains methods for generating property collection views from service responses
        generateSummaryPropertyCollectionView: function(metacards) {
            var propertyArray = ['created', 'modified', 'thumbnail'];
            var propertyIntersection = this.determinePropertyIntersection(metacards);
            var adminPropertyArray = properties.summaryShow.filter((property) => propertyIntersection.indexOf(property) >= 0);
            var propertiesToShow = [];
            propertyArray.concat(adminPropertyArray).forEach(function(property) {
                if (Boolean(metacardDefinitions.metacardTypes[property])){
                    propertiesToShow.push({
                        enumFiltering: true,
                        enum: metacardDefinitions.enums[property],
                        validation: metacardDefinitions.validation[property],
                        label: properties.attributeAliases[property],
                        readOnly: properties.isReadOnly(property),
                        id: property,
                        type: metacardDefinitions.metacardTypes[property].type,
                        values: {},
                        multivalued: metacardDefinitions.metacardTypes[property].multivalued
                    });
                } else {
                    announcement.announce({
                        title: 'Missing Attribute Definition',
                        message: 'Could not find information for '+property+' in definitions.  If this problem persists, contact your Administrator.',
                        type: 'warn'
                    });
                }
            });
            return this.generateCollectionView(propertiesToShow, metacards);
        },
        generatePropertyCollectionView: function(metacards) {
            var propertyCollection = new PropertyCollection();
            var propertyIntersection = this.determinePropertyIntersection(metacards);
            var propertyArray = [];
            propertyIntersection.forEach(function(property) {
                propertyArray.push({
                    enumFiltering: true,
                    enum: metacardDefinitions.enums[property],
                    validation: metacardDefinitions.validation[property],
                    label: properties.attributeAliases[property],
                    readOnly: properties.isReadOnly(property),
                    id: property,
                    type: metacardDefinitions.metacardTypes[property].type,
                    values: {},
                    multivalued: metacardDefinitions.metacardTypes[property].multivalued
                });
            });
            return this.generateCollectionView(propertyArray, metacards);
        },
        generateCollectionView: function(propertyArray, metacards){
            propertyArray.forEach(function(property) {
                metacards.forEach(function(metacard) {
                    var value = metacard[property.id];
                    var isDefined = value !== undefined;
                    if (isDefined) {
                        if (!metacardDefinitions.metacardTypes[property.id].multivalued){
                            if (value.sort === undefined){
                                value = [value];
                            } else {
                                announcement.announce({
                                    title: 'Conflicting Attribute Definition',
                                    message: property.id+' claims to be singlevalued by definition, but the value on the result is not.  If this problem persists, contact your Administrator.',
                                    type: 'warn'
                                });
                            }
                        } else if (value.sort === undefined){
                            announcement.announce({
                                title: 'Conflicting Attribute Definition',
                                message: property.id+' claims to be multivalued by definition, but the value on the result is not.  If this problem persists, contact your Administrator.',
                                type: 'warn'
                            });
                            value = [value];
                        }
                    } else {
                        value = [value];
                    }
                    var key = isDefined ? value : Common.undefined;
                    value.sort();
                    property.value = value;
                    property.values[key] = property.values[key] || {
                        value: isDefined ? value : [],
                        hits: 0,
                        ids: [],
                        hasNoValue: !isDefined 
                    };
                    property.values[key].ids.push(metacard.id);
                    property.values[key].hits++;
                });
                if (metacards.length > 1) {
                    property.bulk = true;
                    if (Object.keys(property.values).length > 1) {
                        property.value = [];
                    }
                }
            });
            return new this({
                collection: new PropertyCollection(propertyArray)
            });
        },
        determinePropertyIntersection: function(metacards) {
            var self = this;
            var attributeKeys = metacards.map(function(metacard) {
                return Object.keys(metacard);
            });
            var types = _.union.apply(this, metacards.map((metacard) => {
                return [metacard['metacard-type']];
            }));
            var possibleAttributes = _.intersection.apply(this, types.map((type) => {
                return Object.keys(metacardDefinitions.metacardDefinitions[type]);
            }));
            var propertyIntersection = _.union.apply(_, attributeKeys).filter((attribute) => {
                return possibleAttributes.indexOf(attribute) >= 0;
            });
            propertyIntersection = propertyIntersection.filter(function(property) {
                if (metacardDefinitions.metacardTypes[property]){
                    return (!properties.isHidden(property)
                    && !metacardDefinitions.isHiddenType(property));
                } else {
                    announcement.announce({
                        title: 'Missing Attribute Definition',
                        message: 'Could not find information for '+property+' in definitions.  If this problem persists, contact your Administrator.',
                        type: 'warn'
                    });
                    return false;
                }
            }).sort(function(a, b){
                a = metacardDefinitions.getLabel(a).toLowerCase();
                b = metacardDefinitions.getLabel(b).toLowerCase();
                if (a < b){
                    return -1;
                }
                if (a > b){
                    return 1;
                }
                return 0;
            });
            return propertyIntersection;
        }
    });
});
