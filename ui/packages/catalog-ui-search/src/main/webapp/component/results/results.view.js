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
import ResultSelector from '../result-selector/result-selector'
import MarionetteRegionContainer from '../../react-component/marionette-region-container'
const Marionette = require('marionette')
const resultsTemplate = require('./results.hbs')
const CustomElements = require('../../js/CustomElements.js')
const QuerySelectDropdown = require('../dropdown/query-select/dropdown.query-select.view.js')
const DropdownModel = require('../dropdown/dropdown.js')
const store = require('../../js/store.js')
const WorkspaceExploreView = require('../workspace-explore/workspace-explore.view.js')

let lastQueryId
const ResultsView = Marionette.LayoutView.extend({
  setDefaultModel() {
    this.model = store.getCurrentQueries()
  },
  template() {
    const queryId = this._resultsSelectDropdownView.model.get('value')
    return (
      <React.Fragment>
        <div className="results-empty">
          <MarionetteRegionContainer view={new WorkspaceExploreView()} />
        </div>
        <div className="results-select">
          <MarionetteRegionContainer view={this._resultsSelectDropdownView} />
        </div>
        <div className="results-list">
          {queryId ? (
            <ResultSelector
              key={queryId}
              model={store.getCurrentQueries().get(queryId)}
              selectionInterface={this.options.selectionInterface}
            />
          ) : (
            <React.Fragment />
          )}
        </div>
      </React.Fragment>
    )
  },
  tagName: CustomElements.register('results'),
  initialize(options) {
    if (options.model === undefined) {
      this.setDefaultModel()
    }
    this._resultsSelectDropdownView = new QuerySelectDropdown({
      model: new DropdownModel({
        value: this.getPreselectedQuery(),
      }),
      dropdownCompanionBehaviors: {
        navigation: {},
      },
    })
    this.listenTo(this._resultsSelectDropdownView.model, 'change:value', () => {
      store.setCurrentQuery(
        store
          .getCurrentQueries()
          .get(this._resultsSelectDropdownView.model.get('value'))
      )
    })
  },
  onFirstRender() {
    this.listenTo(store.get('content'), 'change:currentQuery', () => {
      if (
        store.getCurrentQuery() &&
        store.getCurrentQuery().id !== lastQueryId
      ) {
        lastQueryId = store.getCurrentQuery().id
        this.render()
      }
    })
    this.listenTo(this.model, 'add remove update', this.handleEmptyQueries)
    this.handleEmptyQueries()
  },
  getPreselectedQuery() {
    if (this.model.length === 1) {
      return this.model.first().id
    } else if (this.model.get(lastQueryId)) {
      return lastQueryId
    } else {
      return undefined
    }
  },
  handleEmptyQueries() {
    this.$el.toggleClass('is-empty', this.model.isEmpty())
    if (this.model.length === 1) {
      this._resultsSelectDropdownView.model.set('value', this.model.first().id)
    }
  },
})

module.exports = ResultsView
