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
/*global define*/
define([
    'underscore',
    'backbone',
    'moment'
], function (_, Backbone, moment) {

    return Backbone.Model.extend({
        defaults: {
            value: [],
            values: {},
            enum: undefined,
            label: undefined,
            description: '',
            _initialValue: '',
            readOnly: false,
            validation: '',
            id: '',
            isEditing: false,
            bulk: false,
            multivalued: false,
            type: 'STRING',
            calculatedType: 'text',
            hasChanged: false,
            isValid: false,
            validationMessage: ''
        },
        setDefaultValue: function(){
            if (this.get('initializeToDefault')){
                this.set('value', [this.getDefaultValue()]);
            }
        },
        getDefaultValue: function(){
            switch(this.getCalculatedType()){
                case 'boolean':
                    return true;
                case 'date':
                    return (new Date()).toISOString();
                default:
                    return '';
            }
        },
        //transform incoming value so later comparisons are easier
        transformValue: function(){
            switch(this.getCalculatedType()){
                case 'thumbnail':
                case 'location':
                    return;
                case 'date':
                    var currentValue = this.getValue();
                    currentValue.sort();
                    this.setValue(currentValue.map(function (dateValue) {
                        if (dateValue) {
                            return (moment(dateValue)).toISOString();
                        } else {
                            return dateValue;
                        }
                    }));
                    break;
                case 'number':  //needed until cql result correctly returns numbers as numbers
                    var currentValue = this.getValue();
                    currentValue.sort();
                    this.setValue(currentValue.map(function(value){ 
                        return Number(value); //handle cases of unnecessary number padding -> 22.0000
                    }));
                    break;
                default:
                    return;
            }
        },
        initialize: function(){
            this._setCalculatedType();
            this.setDefaultValue();
            this.transformValue();
            this._setInitialValue();
            this.setDefaultLabel();
            this.listenTo(this, 'change:value', this.updateHasChanged);
        },
        setDefaultLabel: function(){
            if (!this.get('label')){
                this.set('label', this.get('id'));
            }
        },
        hasChanged: function(){
            if (!this.isHomogeneous()){
              //  return this.get('hasChanged');
            }
            switch(this.getCalculatedType()){
                case 'location':
                    return this.get('hasChanged');
                default:
                    var currentValue = this.getValue();
                    currentValue.sort();
                    return JSON.stringify(currentValue) !== JSON.stringify(this.getInitialValue());
            }
        },
        updateHasChanged: function(){
            this.set('hasChanged', this.hasChanged()); 
        },
        getValue: function(){
            return this.get('value');
        },
        setLabel: function(label){
            this.set('label',label);
        },
        setValue: function(val){
            this.set('value', val);
        },
        getId: function(){
            return this.get('id');
        },
        getInitialValue: function(){
            return this.get('_initialValue');
        },
        isReadOnly: function(){
            return this.get('readOnly');
        },
        isEditing: function(){
            return this.get('isEditing');  
        },
        isMultivalued: function(){
            return this.get('multivalued');
        },
        isHomogeneous: function(){
            return !this.get('bulk') || Object.keys(this.get('values')).length <= 1;
        },
        revert: function(){
            this.set({
                hasChanged: false,
                value: this.getInitialValue()
            });
          //  this.trigger('change:value');
        },
        _setInitialValue: function(){
            this.set('_initialValue', this.getValue());
        },
        _setCalculatedType: function() {
            switch (this.get('type')) {
                case 'DATE':
                    this.set('calculatedType', 'date');
                    break;
                case 'BINARY':
                    this.set('calculatedType', 'thumbnail');
                    break;
                case 'LOCATION':
                    this.set('calculatedType', 'location');
                    break;
                case 'BOOLEAN':
                    this.set('calculatedType', 'boolean');
                    break;
                case 'LONG':
                case 'DOUBLE':
                case 'FLOAT':
                case 'INTEGER':
                case 'SHORT':
                    this.set('calculatedType', 'number');
                    break;
                case 'RANGE':
                    this.set('calculatedType', 'range');
                    break;
                case 'GEOMETRY':
                    this.set('calculatedType', 'geometry');
                    break;
                case 'STRING':
                case 'XML':
                default:
                    this.set('calculatedType', 'text');
                    break;
            }
        },
        getCalculatedType: function(){
            return this.get('calculatedType');
        }
    });
});