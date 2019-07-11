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
import ResultItem from '../../../component/result-item/result-item'
const CustomElements = require('../../../js/CustomElements.js')
const BaseGuideView = require('../base-guide/base-guide.view.js')

const SelectionInterfaceModel = require('../../../component/selection-interface/selection-interface.model.js')
const QueryResultModel = require('../../../js/model/QueryResult.js')

const QueryItemView = require('../../../component/query-item/query-item.view.js')
const QueryModel = require('../../../js/model/Query.js')

module.exports = BaseGuideView.extend({
  template() {
    return (
      <React.Fragment>
        <div className="section">
          <div className="is-header">Examples</div>
          <div className="examples is-list has-list-highlighting">
            <div className="example">
              <div className="is-medium-font example-title">Result Item</div>
              <div className="result is-list is-inline example">
                <ResultItem
                  model={
                    new QueryResultModel({
                      actions: [
                        {
                          description: 'example',
                          id: 'example',
                          title: 'example',
                          url: 'https://www.google.com',
                          displayName: 'example',
                        },
                      ],
                      distance: null,
                      hasThumbnail: false,
                      isResourceLocal: true,
                      metacard: {
                        id: 'blah blah blah',
                        cached: '2018-06-28T01:51:32.800+0000',
                        properties: {
                          title: 'Example Result',
                          id: 'example',
                          'metacard-tags': ['deleted', 'VALID'],
                          'validation-errors': ['wow this is way wrong'],
                          'validation-warnings': ['this isonly sort of wrong'],
                          'source-id': 'banana land',
                        },
                      },
                      relevance: 11,
                    })
                  }
                  selectionInterface={new SelectionInterfaceModel()}
                />
              </div>
            </div>
            <div className="example">
              <div className="is-medium-font example-title">Result Item 2</div>
              <div className="result2 is-list is-inline example">
                <ResultItem
                  model={
                    new QueryResultModel({
                      actions: [
                        {
                          description: 'example',
                          id: 'example',
                          title: 'example',
                          url: 'https://example.com',
                          displayName: 'example',
                        },
                      ],
                      distance: null,
                      hasThumbnail: false,
                      isResourceLocal: true,
                      metacard: {
                        id: 'blah blah blah',
                        cached: '2018-06-28T01:51:32.800+0000',
                        properties: {
                          title: 'Example Result',
                          id: 'example',
                          'metacard-tags': ['resource', 'VALID'],
                          'validation-warnings': ['this isonly sort of wrong'],
                          'source-id': 'banana land',
                          'resource-download-url': 'https://example.com',
                        },
                      },
                      relevance: 11,
                    })
                  }
                  selectionInterface={new SelectionInterfaceModel()}
                />
              </div>
            </div>
            <div className="example">
              <div className="is-medium-font example-title">Query Item</div>
              <div className="query is-list is-inline example" />
            </div>
          </div>
        </div>
        <div className="section">
          <div className="is-header">When to Use</div>
          <div className="is-medium-font">
            Utilize this pattern when you want to display a list of items for
            the user to select from. It lets them see the main identifying info
            (title?), some chosen minor details, and quickly take actions.
            Clicking the card anywhere that an action isn't displayed should
            cause the interface to move forward in some way. This could involve
            routing to the item in some way (such as on the workspaces home
            screen), or adding it to a current selection (such as in the results
            list view).
          </div>
        </div>
        <div className="section">
          <div className="is-header">How to Use</div>
          <div>
            <div className="is-medium-font">
              This pattern isn't factored into a component yet, but it's shown
              up enough that it's worth doing soon. In order to implement it,
              use an item's title as the top line, and show as many details as
              needed in the lines below it. The final line should be a sequence
              of action buttons aligned to the right, with the final button
              being a catch all dropdown of all actions. Here's a rough sketch:
            </div>
            <div className="is-list is-inline">
              <div className="sketch">
                <div className="is-bold">Title</div>
                <div>minor detail</div>
                <div>minor detail</div>
                <div>
                  <span className="fa fa-bell is-button" />
                  <span className="fa fa-ellipsis-v is-button" />
                </div>
              </div>
            </div>
            <div className="is-medium-font">
              The title is bolded. The minor details get their opacity decreased
              to the minimum. The most important actions are pulled out of the
              action dropdown, with the rest living within it.
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  },
  tagName: CustomElements.register('dev-card-guide'),
  regions: {
    queryExample: '.example > .query',
  },
  showComponents() {
    this.showQueryExample()
  },
  showQueryExample() {
    this.queryExample.show(
      new QueryItemView({
        model: new QueryModel.Model(),
      })
    )
  },
})
