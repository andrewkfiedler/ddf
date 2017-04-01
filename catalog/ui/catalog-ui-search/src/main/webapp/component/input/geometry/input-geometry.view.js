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
var _ = require('underscore');

function convertUserValueToWKT(val){
    val = val.split(' (').join('(').split(', ').join(',');
    val = val.split('MULTIPOINT').map(function(value, index){
        if (index % 2 === 1 && value.indexOf('((') !== -1) {
            return value.split('((').join('(').split('),(').join(',').split('))').join(')');
        } else {
            return value;
        }
    }).join('MULTIPOINT');
    return val;
}

module.exports = InputView.extend({
        template: template,
        initialize: function(){
            InputView.prototype.initialize.call(this);
            //this.checkValidation = _.debounce(this.checkValidation, 500);
        },
        getCurrentValue: function(){
            //return wkx.Geometry.parse(this.$el.find('input').val()).toGeoJSON();
            this.checkValidation();
            return this.$el.find('input').val();
        },
        checkValidation: function(){
            try {
                var test = wkx.Geometry.parse(this.$el.find('input').val());
                if (test.toWkt() === convertUserValueToWKT(this.$el.find('input').val())) {
                    this.$el.removeClass('has-validation-issues');
                } else {
                    this.$el.addClass('has-validation-issues');
                }
            } catch (err){
                this.$el.addClass('has-validation-issues');
            }
        },
        handleValue: function(){
            var value = this.model.getValue();
            if (value && value.constructor === Object) {
                this.$el.find('input').val(wkx.Geometry.parseGeoJSON(value).toWkt());
            } else {
                this.$el.find('input').val(value);
            }
        }
});