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
var _ = require('underscore');
var $ = require('jquery');
var template = require('./list-editor.hbs');
var CustomElements = require('js/CustomElements');
require('behaviors/button.behavior');
var DropdownView = require('component/dropdown/dropdown.view');
var PropertyView = require('component/property/property.view');
var Property = require('component/property/property');
var List = require('js/model/List');
var DropdownView = require('component/dropdown/popout/dropdown.popout.view');
var ListFilterView = require('component/result-filter/list/result-filter.list.view');

module.exports = Marionette.LayoutView.extend({
  tagName: CustomElements.register('list-editor'),
  template: template,
  events: {
    'click .editor-cancel': 'cancel',
    'click .editor-save': 'save'
  },
  regions: {
    listTitle: '.list-title',
    listLimitingAttributeSwitch: '.list-limiting-attribute-switch',
    listLimitingAttribute: '.list-limiting-attribute',
    listLimitingAttributeValues: '.list-limiting-attribute-values',
    listIcon: '.list-icon'
  },
  onBeforeShow: function() {
    this.showListTitle();
    this.showLimitingAttributeSwitch();
    this.showLimitingAttribute();
    this.showIcon();
    this.turnOnLimitedWidth();
    this.edit();
  },
  showListTitle: function() {
    this.listTitle.show(
      PropertyView.getPropertyView({
        label: 'Title',
        value: [this.model.get('title')],
        type: 'TEXT'
      })
    );
  },
  showLimitingAttributeSwitch: function() {
    this.listLimitingAttributeSwitch.show(
      PropertyView.getPropertyView({
        label: 'Limit based on filter',
        value: [this.model.get('limitingAttribute') !== ''],
        radio: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false
          }
        ]
      })
    );
    this.listenTo(this.listLimitingAttributeSwitch.currentView.model, 'change:value', this.handleLimitingAttributeSwitch);
    this.handleLimitingAttributeSwitch();
  },
  handleLimitingAttributeSwitch: function() {
    var shouldLimitByAttribute = this.listLimitingAttributeSwitch.currentView.model.getValue()[0];
    this.$el.toggleClass('is-limited-by-attribute', shouldLimitByAttribute);
  },
  showLimitingAttribute: function() {
    this.listLimitingAttribute.show(
      DropdownView.createSimpleDropdown({
        componentToShow: ListFilterView,
        defaultSelection: this.model.get('limitingAttribute'),
        leftIcon: 'fa fa-pencil',
        label: 'Edit Filter'
      })
    );
  },
  showIcon: function() {
    this.listIcon.show(
      PropertyView.getPropertyView({
        label: 'Icon',
        value: [this.model.get('icon')],
        enum: List.getIconMappingForSelect()
      })
    );
  },
  turnOnLimitedWidth: function() {
    this.regionManager.forEach(function(region) {
      if (region.currentView && region.currentView.turnOnLimitedWidth) {
        region.currentView.turnOnLimitedWidth();
      }
    });
  },
  edit: function() {
    this.$el.addClass('is-editing');
    this.regionManager.forEach(function(region) {
      if (region.currentView && region.currentView.turnOnEditing) {
        region.currentView.turnOnEditing();
      }
    });
    var tabable = _.filter(this.$el.find('[tabindex], input, button'), function(
      element
    ) {
      return element.offsetParent !== null;
    });
    if (tabable.length > 0) {
      $(tabable[0]).focus();
    }
  },
  cancel: function() {
    this.$el.removeClass('is-editing');
    this.onBeforeShow();
    this.$el.trigger('closeDropdown.' + CustomElements.getNamespace());
  },
  saveIcon: function() {
    this.model.set('icon', this.listIcon.currentView.model.getValue()[0]);
  },
  saveTitle: function() {
    this.model.set('title', this.listTitle.currentView.model.getValue()[0]);
  },
  saveLimitingAttribute: function() {
    var shouldLimitByAttribute = this.listLimitingAttributeSwitch.currentView.model.getValue()[0];
    if (shouldLimitByAttribute) {
      this.model.set('limitingAttribute', this.listLimitingAttribute.currentView.model.getValue());
    } else {
      this.model.set('limitingAttribute', '');
    }
  },
  save: function() {
    this.saveTitle();
    this.saveIcon();
    this.saveLimitingAttribute();
    this.cancel();
  },
  serializeData: function() {
    return this.model.toJSON({
      additionalProperties: ['cid', 'color']
    });
  }
});
