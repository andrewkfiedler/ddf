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
/*global define*/
const Marionette = require('marionette')
const _ = require('underscore')
const $ = require('jquery')
const CustomElements = require('../../js/CustomElements.js')
const user = require('../singletons/user-instance.js')
const FilterBuilderView = require('../filter-builder/filter-builder.view.js')
const cql = require('../../js/cql.js')
import * as React from 'react'
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'

const CustomFilterBuilderView = FilterBuilderView.extend({
  onBeforeShow() {
    FilterBuilderView.prototype.onBeforeShow.call(this)
    this.turnOnEditing()
    this.turnOffNesting()
  },
})

module.exports = Marionette.LayoutView.extend({
  template() {
    return (
      <React.Fragment>
        <MarionetteRegionContainer
          className="editor-properties"
          view={this.view}
        />
        <div className="editor-properties" />
        <div className="editor-footer">
          <button className="footer-remove is-negative">Remove Filter</button>
          <button className="footer-save is-positive">Save Filter</button>
        </div>
      </React.Fragment>
    )
  },
  tagName: CustomElements.register('result-filter'),
  modelEvents: {
    change: 'render',
  },
  events: {
    'click > .editor-footer .footer-remove': 'removeFilter',
    'click > .editor-footer .footer-save': 'saveFilter',
  },
  initialize: function() {
    this.handleFilter()
    var resultFilter = this.getResultFilter()
    let filter
    if (resultFilter) {
      filter = cql.simplify(cql.read(resultFilter))
    } else {
      filter = {
        property: 'anyText',
        value: '',
        type: 'ILIKE',
      }
    }
    this.view = new CustomFilterBuilderView({
      filter,
      isResultFilter: true,
    })
  },
  getResultFilter: function() {
    return user
      .get('user')
      .get('preferences')
      .get('resultFilter')
  },
  getFilter: function() {
    return this.view.transformToCql()
  },
  removeFilter: function() {
    user
      .get('user')
      .get('preferences')
      .set('resultFilter', undefined)
    user
      .get('user')
      .get('preferences')
      .savePreferences()
    this.$el.trigger('closeDropdown.' + CustomElements.getNamespace())
  },
  saveFilter: function() {
    user
      .get('user')
      .get('preferences')
      .set('resultFilter', this.getFilter())
    user
      .get('user')
      .get('preferences')
      .savePreferences()
    this.$el.trigger('closeDropdown.' + CustomElements.getNamespace())
  },
  handleFilter: function() {
    var resultFilter = this.getResultFilter()
    this.$el.toggleClass('has-filter', Boolean(resultFilter))
  },
})
