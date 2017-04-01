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
/*global require, window */
/*jslint nomen:false, -W064 */
window.CESIUM_BASE_URL = './cesium/';
var $ = require('jquery');
$.ajaxSetup({
    cache: false
});

require([
    'underscore',
    'jquery',
    'backbone',
    'marionette',
    'handlebars/dist/handlebars',
    'component/announcement',
    'js/Marionette.Region',
    'js/requestAnimationFramePolyfill',
    'js/HandlebarsHelpers',
    'js/ApplicationHelpers',
    'cesium.css',
    'js/Autocomplete',
], function(_, $, Backbone, Marionette, hbs, announcement) {

    $(window.document).ajaxError(function(event, jqxhr, settings, throwError) {
        var message;
        console.error(event, jqxhr, settings, throwError);

        if (jqxhr.responseJSON !== undefined) {
            message = jqxhr.responseJSON.message;
        }

        if (!settings.customErrorHandling) {
            var defaultTitle = 'Server Error';
            var defaultMessage = 'Unknown error.';

            if (jqxhr.status === 403) {
                defaultTitle = 'Forbidden';
                defaultMessage = 'Not Authorized';
            }

            announcement.announce({
                title: defaultTitle,
                message: message || defaultMessage,
                type: 'error'
            });
        }
    });

    // Make lodash compatible with Backbone
    var lodash = _.noConflict();
    _.mixin({
        'debounce': _.debounce || lodash.debounce,
        'defer': _.defer || lodash.defer,
        'pluck': _.pluck || lodash.pluck
    });
    //in here we drop in any top level patches, etc.
    var toJSON = Backbone.Model.prototype.toJSON;
    Backbone.Model.prototype.toJSON = function(options) {
        var originalJSON = toJSON.call(this, options);
        if (options && options.additionalProperties !== undefined) {
            var backboneModel = this;
            options.additionalProperties.forEach(function(property) {
                originalJSON[property] = backboneModel[property];
            });
        }
        return originalJSON;
    };
    var clone = Backbone.Model.prototype.clone;
    Backbone.Model.prototype.clone = function() {
        var cloneRef = clone.call(this);
        cloneRef._cloneOf = this.id || this.cid;
        return cloneRef;
    };
    var associationsClone = Backbone.AssociatedModel.prototype.clone;
    Backbone.AssociatedModel.prototype.clone = function() {
        var cloneRef = associationsClone.call(this);
        cloneRef._cloneOf = this.id || this.cid;
        return cloneRef;
    };
    Marionette.Renderer.render = function(template, data, view) {
        data._view = view;
        if (typeof template === 'function') {
            return template(data);
        } else {
            return hbs.compile(template)(data);
        }
    };

    require('js/ApplicationStart');
});