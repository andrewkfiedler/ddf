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
var wreqr = require('wreqr');
var _ = require('underscore');
var template = require('./timeslider.hbs');
var Marionette = require('marionette');
var MarionetteRegion = require('js/Marionette.Region');
var CustomElements = require('js/CustomElements');
var store = require('js/store');
var $ = require('jquery');
var metacardDefinitions = require('component/singletons/metacard-definitions');
var Common = require('js/Common');

//this.options.selectionInterface.getActiveSearchResults()
//this.options.selectionInterface.getSelectedResults()
//this.options.selectionInterface.clearSelectedResults();
//this.options.selectionInterface.addSelectedResult(single or multiple results);
//this.options.selectionInterface.addSelectedResult(single or multiple results);

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('timeslider'),
    template: template,
    events: {
    },
    initialize: function(options) {
        if (!options.selectionInterface) {
            throw 'Selection interface has not been provided';
        }
        this.setupListeners();
    },
    handleEmpty: function() {
        this.$el.toggleClass('is-empty', this.options.selectionInterface.getActiveSearchResults().length === 0);
    },
    setupListeners: function(){
        this.listenTo(this.options.selectionInterface, 'reset:activeSearchResults', this.onBeforeShow);
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'update', this.updateTimeslider);
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'add', this.updateTimeslider);
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'remove', this.updateTimeslider);
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'reset', this.updateTimeslider);
    },
    onBeforeShow: function(){
        this.showTimeslider();
        this.handleEmpty();
    },
    showTimeslider: function(){
        // setup your timeslider based on the current activeSearchResults
    },
    updateTimeslider: function(){
        // don't redo the whole timeslider, but handle updates to selected results
    }
});