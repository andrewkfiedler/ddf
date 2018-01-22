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
/*global define, require, module*/
var Marionette = require('marionette');
var $ = require('jquery');
var template = require('./result-add.hbs');
var CustomElements = require('js/CustomElements');
var store = require('js/store');
var ListCreateView = require('component/list-create/list-create.view');
var lightboxInstance = require('component/lightbox/lightbox.view.instance');
var List = require('js/model/list');
var PopoutView = require('component/dropdown/popout/dropdown.popout.view');
var filter = require('js/filter');
var cql = require('js/cql');
var _ = require('lodash');

module.exports = Marionette.LayoutView.extend({
  tagName: CustomElements.register('result-add'),
  template: template,
  events: {
    'click .is-existing-list.matches-filter:not(.already-contains)': 'addToList'
  },
  regions: {
    newList: '.create-new-list'
  },
  addToList: function(e){
    var listId = $(e.currentTarget).data('id');
    store.getCurrentWorkspace().get('lists').get(listId).addBookmarks(this.model.get('metacard').id);
  },
  onRender: function() {
    this.setupCreateList();
  },
  setupCreateList: function() {
    this.newList.show(PopoutView.createSimpleDropdown({
      componentToShow: ListCreateView,
      modelForComponent: this.model,
      leftIcon: 'fa fa-plus',
      label: 'Create New List',
      options: {
        withBookmarks: true
      }
    }));
  },
  initialize: function(){
    this.listenTo(store.getCurrentWorkspace().get('lists'), 'add remove update change', this.render);
  },
  serializeData: function() {
    var listJSON = store.getCurrentWorkspace().get('lists').toJSON();
    listJSON = listJSON.map((list) => {
      list.matchesFilter = true;
      if (list.limitingAttribute !== '') {
        list.matchesFilter = this.model.matchesCql(list.limitingAttribute);
      } 
      list.alreadyContains = false;
      if (list.bookmarks.indexOf(this.model.get('metacard').id) >= 0) {
        list.alreadyContains = true;
      }
      list.icon = List.getIconMapping()[list.icon];
      return list;
    });
    return listJSON;
  }
});
