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
/*global define, setTimeout*/
var Marionette = require('marionette');
var CustomElements = require('js/CustomElements');
var template = require('./workspace-lists.hbs');
var store = require('js/store');
var ListSelectorView = require('component/dropdown/list-select/dropdown.list-select.view');
var DropdownModel = require('component/dropdown/dropdown');
var ResultSelectorView = require('component/result-selector/result-selector.view');

let selectedListId;

module.exports = Marionette.LayoutView.extend({
    setDefaultModel: function(){
        this.model = store.getCurrentWorkspace().get('lists');
    },
    template: template,
    tagName: CustomElements.register('workspace-lists'),
    regions: {
        listSelect: '> .list-select',
        listEmpty: '.list-empty',
        listResults: '.list-results'
    },
    initialize: function(options){
        if (options.model === undefined){
            this.setDefaultModel();
        }
    },
    onBeforeShow: function () {
        if (store.getCurrentWorkspace()) {
            this.setupWorkspaceListSelect();
        }
    },
    getPreselectedList: function(){
        if (this.model.length === 1){
            return this.model.first().id;
        } else if (this.model.get(selectedListId)) {
            return selectedListId;
        } else {
            return undefined;
        }
    },
    setupWorkspaceListSelect: function(){
        this.listSelect.show(new ListSelectorView({
            model: new DropdownModel({
                value: this.getPreselectedList()
            }),
            workspaceLists: store.getCurrentWorkspace().get('lists')
        }));
        this.listenTo(this.listSelect.currentView.model, 'change:value', this.updateResultsList);
        //this.listEmpty.show(new WorkspaceExploreView());
        this.updateResultsList();
        this.handleEmptyLists();
        this.listenTo(this.model, 'add', this.handleEmptyLists);
        this.listenTo(this.model, 'remove', this.handleEmptyLists);
        this.listenTo(this.model, 'update', this.handleEmptyLists);
    },
    handleEmptyLists: function() {
        this.$el.toggleClass('is-empty', this.model.isEmpty());
        if (this.model.length === 1){
            this.listSelect.currentView.model.set('value', this.model.first().id);
        }
    },
    updateResultsList: function() {
        var listId = this.listSelect.currentView.model.get('value');
        if (listId){
            selectedListId = listId;
            this.listResults.show(new ResultSelectorView({
                model: store.getCurrentWorkspace().get('lists').get(listId).get('query')
            }));
        } else {
            this.listResults.empty();
        }
    }
});