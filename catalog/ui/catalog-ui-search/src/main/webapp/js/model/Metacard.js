/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
var Backbone = require('backbone');
var _ = require('underscore');
var wreqr = require('wreqr');
require('backboneassociations');

var MetacardPropertiesModel = require('js/model/MetacardProperties');
var MetacardActionModel = require('js/model/MetacardAction');

module.exports = Backbone.AssociatedModel.extend({
    hasGeometry: function(attribute){
        return this.get('properties').hasGeometry(attribute);
    },
    getPoints: function(attribute){
        return this.get('properties').getPoints(attribute);
    },
    getGeometries: function(attribute){
        return this.get('properties').getGeometries(attribute);
    },
    relations: [
        {
            type: Backbone.One,
            key: 'properties',
            relatedModel: MetacardPropertiesModel
        },
        {
            type: Backbone.Many,
            key: 'actions',
            relatedModel: MetacardActionModel
        }
    ],
    defaults: {
        'queryId': undefined
    }
});