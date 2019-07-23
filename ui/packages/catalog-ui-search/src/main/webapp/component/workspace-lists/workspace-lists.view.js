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
import * as React from 'react'
import ListCreate from '../list-create/list-create.js'
import ResultSelector from '../result-selector/result-selector'
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'
const Marionette = require('marionette')
const CustomElements = require('../../js/CustomElements.js')
const template = require('./workspace-lists.hbs')
const store = require('../../js/store.js')
const ListSelectorView = require('../dropdown/list-select/dropdown.list-select.view.js')
const DropdownModel = require('../dropdown/dropdown.js')
const ResultSelectorView = require('../result-selector/result-selector.view.js')

const $ = require('jquery')
const PopoutView = require('../dropdown/popout/dropdown.popout.view.js')

const triggerSearch = () => {
  $('.content-adhoc')
    .mousedown()
    .click()
}

let lastListId
const triggerDelete = () => {
  const model = store.getCurrentWorkspace().get('lists')
  model.remove(model.get(lastListId))
}
module.exports = Marionette.LayoutView.extend({
  setDefaultModel() {
    this.model = store.getCurrentWorkspace().get('lists')
  },
  template() {
    const listId = this._listSelectDropdownView.model.get('value')
    lastListId = listId
    return (
      <React.Fragment>
        <div align="center" className="lists-empty">
          <div className="is-header">
            You don't have any lists.{' '}
            <button
              className="quick-search is-primary in-text"
              onClick={triggerSearch}
            >
              Search
            </button>
            for something and add it to a list or create a
            <div className="quick-create is-primary in-text composed-button">
              <MarionetteRegionContainer view={this._listCreateQuickView} />
            </div>
            .
          </div>
        </div>
        <div className="list-select">
          <MarionetteRegionContainer view={this._listSelectDropdownView} />
        </div>
        <div className="list-empty">
          <div className="is-header">
            Your list is empty.{' '}
            <button
              className="quick-search is-primary in-text"
              onClick={triggerSearch}
            >
              Search
            </button>{' '}
            for something and add it to the list, or{' '}
            <button
              className="quick-delete is-negative in-text"
              onClick={triggerDelete}
            >
              delete
            </button>{' '}
            this list.
          </div>
        </div>
        <div className="list-results">
          {listId && !this.model.get(listId).isEmpty() ? (
            <ResultSelector
              key={listId}
              model={this.model.get(listId).get('query')}
              selectionInterface={this.options.selectionInterface}
              tieredSearchIds={this.model.get(listId).get('list.bookmarks')}
            />
          ) : (
            <React.Fragment />
          )}
        </div>
      </React.Fragment>
    )
  },
  tagName: CustomElements.register('workspace-lists'),
  initialize(options) {
    if (options.model === undefined) {
      this.setDefaultModel()
    }
    this._listCreateQuickView = PopoutView.createSimpleDropdown({
      componentToShow: ListCreate,
      modelForComponent: this.model,
      label: 'new list',
      options: {
        withBookmarks: false,
      },
    })
    this._listSelectDropdownView = new ListSelectorView({
      model: new DropdownModel({
        value: this.getPreselectedList(),
      }),
      workspaceLists: this.model,
      dropdownCompanionBehaviors: {
        navigation: {},
      },
    })
    this.listenTo(this._listSelectDropdownView.model, 'change:value', () => {
      this.render()
    })
    this.listenTo(
      this.model,
      'remove update change:list.bookmarks add',
      this.render
    )
    this.listenTo(this.model, 'add', this.handleAdd)
  },
  getPreselectedList() {
    if (this.model.length === 1) {
      return this.model.first().id
    } else if (this.model.get(lastListId)) {
      return lastListId
    } else {
      return undefined
    }
  },
  handleAdd(newList, lists, options) {
    if (options.preventSwitch !== true) {
      this._listSelectDropdownView.model.set('value', newList.id)
      this._listSelectDropdownView.model.close()
    }
  },
  onRender() {
    this.handleEmptyLists()
    this.handleEmptyList()
    this.handleSelection()
  },
  handleSelection() {
    this.$el.toggleClass(
      'has-selection',
      this.model.get(this._listSelectDropdownView.model.get('value')) !==
        undefined
    )
  },
  handleEmptyLists() {
    this.$el.toggleClass('is-empty-lists', this.model.isEmpty())
    if (this.model.length === 1) {
      this._listSelectDropdownView.model.set('value', this.model.first().id)
    }
  },
  handleEmptyList() {
    if (this.model.get(lastListId) && this.model.get(lastListId).isEmpty()) {
      this.$el.addClass('is-empty-list')
    } else {
      this.$el.removeClass('is-empty-list')
    }
  },
})
