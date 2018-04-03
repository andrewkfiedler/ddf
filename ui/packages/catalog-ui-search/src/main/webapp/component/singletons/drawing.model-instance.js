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
/*global require*/
const Backbone = require('backbone');
const wreqr = require('wreqr');

module.exports = new (Backbone.Model.extend({
    defaults: {
        drawing: false,
        drawingModel: undefined
    },
    initialize: function() {
        /*  
            todo: once we merge DDF-3715 move this logic to the 
            drawing.controller 
            (have it require us and call us rather than use wreqr)
        */
        this.listenTo(wreqr.vent, 'search:drawline', this.turnOnDrawing);
        this.listenTo(wreqr.vent, 'search:drawcircle', this.turnOnDrawing);
        this.listenTo(wreqr.vent, 'search:drawpoly', this.turnOnDrawing);
        this.listenTo(wreqr.vent, 'search:drawbbox', this.turnOnDrawing);
        this.listenTo(wreqr.vent, 'search:drawstop', this.turnOffDrawing);
        this.listenTo(wreqr.vent, 'search:drawend', this.turnOffDrawing);
    },
    turnOnDrawing: function(model){
        this.set('drawing', true);
        this.set('drawingModel', model);
        $('html').toggleClass('is-drawing', true);
    },
    turnOffDrawing: function(){
        this.set('drawing', false);
        $('html').toggleClass('is-drawing', false);
    },
    isDrawing: function() {
        return this.get('drawing');
    },
    getDrawingModel: function() {
        return this.get('drawingModel');
    }
}))();