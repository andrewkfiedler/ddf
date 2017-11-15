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
/*global define, alert, window*/
define([
    'marionette',
    'underscore',
    'jquery',
    './input-color.hbs',
    'js/CustomElements',
    '../input.view',
    'spectrum-colorpicker'
], function (Marionette, _, $, template, CustomElements, InputView) {

    return InputView.extend({
        template: template,
        events: {
        },
        serializeData: function () {
            return _.extend(this.model.toJSON(), {
                cid: this.cid
            });
        },
        onRender: function () {
            this.initializeColorpicker();
            InputView.prototype.onRender.call(this);
        },
        initializeColorpicker: function(){
            this.$el.find('input').spectrum({
                showInput: true,
                showInitial: true
            });
            this.$el.find('.sp-replacer').addClass('is-input');
            this.$el.find('.sp-dd').replaceWith('<button class="is-primary"><span class="fa fa-caret-down"></span></button>');
        },
        handleReadOnly: function () {
            this.$el.toggleClass('is-readOnly', this.model.isReadOnly());
        },
        handleValue: function(){
            this.$el.find('input').spectrum('set', this.model.getValue());
        },
        focus: function(){
            this.$el.find('input').select();
        },
        getCurrentValue: function(){
            var currentValue = this.$el.find('input').val();
            if (currentValue){
                return currentValue;
            } else {
                return 'white';
            }
        },
        listenForChange: function(){
            this.$el.on('input change keyup', function(){
                this.model.set('value', this.getCurrentValue());
            }.bind(this));
        },
        onDestroy: function(){
            var colorpicker = this.$el.find('input');
            if (colorpicker) {
                colorpicker.spectrum('destroy');
            }
        }
    });
});
