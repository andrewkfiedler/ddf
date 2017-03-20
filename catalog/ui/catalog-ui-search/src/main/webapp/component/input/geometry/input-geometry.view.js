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
/*global require*/
var Marionette = require('marionette');
var InputView = require('../input.view');
var wkx = require('wkx');
var template = require('./input-geometry.hbs');

module.exports = InputView.extend({
        template: template,
        getCurrentValue: function(){
            //return wkx.Geometry.parse(this.$el.find('input').val()).toGeoJSON();
            return this.$el.find('input').val();
        },
        handleValue: function(){
            var value = this.model.getValue();
            if (value.constructor === Object) {
                this.$el.find('input').val(wkx.Geometry.parseGeoJSON(value).toWkt());
            } else {
                this.$el.find('input').val(value);
            }
        }
});