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

import { hot } from 'react-hot-loader'
import * as React from 'react'
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'
import styled from '../../react-component/styles/styled-components'
import { readableColor } from 'polished'
import { useBackbone } from '../../hooks/index'
import {
  buttonTypeEnum,
  Button,
} from '../../react-component/presentation/button'
import Dropdown from '../../react-component/presentation/dropdown'
const MetacardInteractionsDropdown = require('../../react-component/container/metacard-interactions/metacard-interactions-dropdown')
  .default

const Backbone = require('backbone')
const IconHelper = require('../../js/IconHelper.js')
const store = require('../../js/store.js')
const Common = require('../../js/Common.js')
const DropdownModel = require('../dropdown/dropdown.js')
const ResultIndicatorView = require('../result-indicator/result-indicator.view.js')
const properties = require('../../js/properties.js')
const user = require('../singletons/user-instance.js')
const metacardDefinitions = require('../singletons/metacard-definitions.js')
const moment = require('moment')
const sources = require('../singletons/sources-instance.js')
const HoverPreviewDropdown = require('../dropdown/hover-preview/dropdown.hover-preview.view.js')
const ResultAddView = require('../result-add/result-add.view.js')
const PopoutView = require('../dropdown/popout/dropdown.popout.view.js')

require('../../behaviors/button.behavior.js')
require('../../behaviors/dropdown.behavior.js')
const HandleBarsHelpers = require('../../js/HandlebarsHelpers.js')
const ResultLinkView = require('../result-link/result-link.view.js')
const {
  SelectItemToggle,
} = require('../selection-checkbox/selection-checkbox.view.js')
import ExtensionPoints from '../../extension-points'
const NormalExtensions = ExtensionPoints.resultItem.extensions
const ButtonExtensions = ExtensionPoints.resultItem.buttonExtensions

const LIST_DISPLAY_TYPE = 'List'
const GRID_DISPLAY_TYPE = 'Grid'

const renderResultLink = (shouldRender: any, model: any) =>
  shouldRender && (
    <MarionetteRegionContainer
      className="result-link is-button is-neutral composed-button"
      data-help="Follow external links."
      view={(props: any) => PopoutView.createSimpleDropdown(props)}
      viewOptions={{
        componentToShow: ResultLinkView,
        modelForComponent: model,
        leftIcon: 'fa fa-external-link',
      }}
    />
  )

const getResultDisplayType = () =>
  (user &&
    user
      .get('user')
      .get('preferences')
      .get('resultDisplay')) ||
  LIST_DISPLAY_TYPE

const Divider = styled.div`
  height: ${props => props.theme.borderRadius};
  background: ${props => readableColor(props.theme.backgroundContent)};
  opacity: 0.1;
  margin-top: ${props => props.theme.minimumSpacing};
`

const Footer = styled.div`
  background: rgba(0, 0, 0, 0.05);
`

type Props = {
  selectionInterface: any
  model: any
  onClick: any
  onMouseDown: any
}

const defaultExtension = () => {
  return null
}

const isGrid = () => {
  switch (getResultDisplayType()) {
    case LIST_DISPLAY_TYPE:
      return false
    case GRID_DISPLAY_TYPE:
      return true
    default:
      return false
  }
}

const isBlacklisted = (model: any) => {
  const pref = user.get('user').get('preferences')
  const blacklist = pref.get('resultBlacklist')
  const id = model
    .get('metacard')
    .get('properties')
    .get('id')
  const isBlacklisted = blacklist.get(id) !== undefined
  return isBlacklisted
}

const inWorkspace = () => {
  const currentWorkspace = store.getCurrentWorkspace()
  return Boolean(currentWorkspace)
}

const addConfiguredResultProperties = (result: any) => {
  result.showSource = false
  result.customDetail = []
  if (properties.resultShow) {
    properties.resultShow.forEach((additionProperty: any) => {
      if (additionProperty === 'source-id') {
        result.showSource = true
        return
      }
      let value = result.metacard.properties[additionProperty]
      if (value && metacardDefinitions.metacardTypes[additionProperty]) {
        switch (metacardDefinitions.metacardTypes[additionProperty].type) {
          case 'DATE':
            if (value.constructor === Array) {
              value = value.map((val: any) => Common.getMomentDate(val))
            } else {
              value = Common.getMomentDate(value)
            }
            break
        }
        result.customDetail.push({
          label: additionProperty,
          value,
        })
      }
    })
  }
  return result
}

const massageResult = (model: any) => {
  const result = model.toJSON()
  //make a nice date
  result.local = Boolean(
    result.metacard.properties['source-id'] === sources.localCatalog
  )
  const dateModified = moment(result.metacard.properties.modified)
  result.niceDiff = Common.getMomentDate(dateModified)

  //icon
  result.icon = IconHelper.getClass(model)

  //check validation errors
  const validationErrors = result.metacard.properties['validation-errors']
  const validationWarnings = result.metacard.properties['validation-warnings']
  if (validationErrors) {
    result.hasError = true
    result.error = validationErrors
  }
  if (validationWarnings) {
    result.hasWarning = true
    result.warning = validationWarnings
  }

  //relevance score
  result.showRelevanceScore =
    properties.showRelevanceScores && result.relevance !== null
  if (result.showRelevanceScore === true) {
    result.roundedRelevance = parseFloat(result.relevance).toPrecision(
      properties.relevancePrecision
    )
  }

  return result
}

type ResultItemRootProps = {
  isWorkspace: boolean
  isResource: boolean
  inWorkspace: boolean
  isBlacklisted: boolean
  isGrid: boolean
  isRevision: boolean
  isDeleted: boolean
  isDownloadable: boolean
  isLink: boolean
}

const ResultItemRoot = styled<ResultItemRootProps, 'div'>('div')`
  display: block;
  width: 100%;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  opacity: ${props => (props.isBlacklisted ? '0.4' : '1')};

  .content-header {
    white-space: nowrap;
    line-height: ${props => props.theme.minimumLineSize};
    height: ${props => props.theme.minimumLineSize};
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px ${props => props.theme.minimumSpacing};

    > .header-title {
      display: inline;
    }
  }

  .content-footer {
    white-space: nowrap;
    text-align: right;
    height: ${props => props.theme.minimumButtonSize};
    padding: 0px ${props => props.theme.minimumSpacing};

    > .result-download {
      display: ${props => (props.isDownloadable ? 'inline-block' : 'none')};
    }

    > .result-actions,
    .result-validation,
    .result-extension {
      display: inline-block;
    }
    > div,
    > button {
      text-align: center;
      vertical-align: top;
      width: ${props => props.theme.minimumButtonSize};
      height: ${props => props.theme.minimumButtonSize};
      line-height: ${props => props.theme.minimumButtonSize};
    }
  }

  .container-indicator {
    position: absolute;
    left: 0px;
    top: 0px;
    width: calc(0.5 * ${props => props.theme.minimumSpacing});
    height: 100%;
  }

  .container-content {
    width: calc(100% - 0.5 * ${props => props.theme.minimumSpacing});
    position: relative;
    left: calc(0.5 * ${props => props.theme.minimumSpacing});
  }

  .result-add {
    display: ${props => (props.inWorkspace ? 'inline-block' : 'none')};
  }

  .result-link {
    display: ${props => (props.isLink ? 'inline-block' : 'none')};
  }

  .details-property {
    height: ${props => props.theme.minimumLineSize};
    line-height: ${props => props.theme.minimumLineSize};
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content-body {
    padding: 0px ${props => props.theme.minimumSpacing};
  }

  .content-body .details-property {
    opacity: ${props => props.theme.minimumOpacity};
  }

  .result-validation .resultError {
    color: ${props => props.theme.negativeColor} !important;
  }

  .result-validation .resultWarning {
    color: ${props => props.theme.warningColor} !important;
  }

  .result-validation .resultWarning,
  .result-validation .resultError {
    display: inline-block;
    width: 100%;
    line-height: inherit;
  }

  .detail-thumbnail {
    display: ${props => (props.isGrid ? 'block' : 'none')};
    opacity: 1;
    height: auto;
    padding: calc(0.5 * ${props => props.theme.minimumSpacing}) 0px;
    img {
      max-width: 100%;
      max-height: 120px;
    }
  }

  .header-icon {
    display: none;
    padding-right: ${props => props.theme.minimumSpacing};
  }

  .header-icon.fa-book {
    display: ${props => (props.isWorkspace ? 'inline' : 'none')};
  }

  .header-icon.result-icon {
    display: ${props => (props.isResource ? 'inline' : 'none')};
  }

  .header-icon.fa-history {
    display: ${props => (props.isRevision ? 'inline' : 'none')};
  }

  .header-icon.fa-trash {
    display: ${props => (props.isDeleted ? 'inline' : 'none')};
  }

  .source-icon {
    display: inline;
    padding-right: ${props => props.theme.minimumSpacing};
  }

  .checkbox-container {
    float: left;
  }
`

const isSelected = ({
  selectionInterface,
  model,
}: {
  selectionInterface: any
  model: any
}) => {
  const selectedResults = selectionInterface.getSelectedResults()
  const isSelected = selectedResults.get(model.id)
  return Boolean(isSelected)
}

const mapStuffToState = ({
  selectionInterface,
  model,
}: {
  selectionInterface: any
  model: any
}) => {
  return {
    inWorkspace: inWorkspace(),
    isBlacklisted: isBlacklisted(model),
    isGrid: isGrid(),
    isWorkspace: model.isWorkspace(),
    isResource: model.isResource(),
    isRevision: model.isRevision(),
    isDeleted: model.isDeleted(),
    isDownloadable:
      model
        .get('metacard')
        .get('properties')
        .get('resource-download-url') !== undefined,
    isLink:
      model
        .get('metacard')
        .get('properties')
        .get('associations.external') !== undefined,
    isSelected: isSelected({ selectionInterface, model }),
  }
}

const ResultItem = (props: Props) => {
  const { model, selectionInterface, onClick, onMouseDown } = props
  const data = addConfiguredResultProperties(massageResult(model))
  const displayAsGrid = getResultDisplayType() === GRID_DISPLAY_TYPE
  const renderThumbnail = displayAsGrid && data.metacard.properties.thumbnail
  const renderResultLinkDropdown = model
    .get('metacard')
    .get('properties')
    .get('associations.external')

  const [state, setState] = React.useState(
    mapStuffToState({ model, selectionInterface })
  )

  const { listenTo } = useBackbone()
  React.useEffect(() => {
    listenTo(model, 'change:metacard>properties change:metacard', () => {
      setState(mapStuffToState({ model, selectionInterface }))
    })
    listenTo(
      user.get('user').get('preferences'),
      'change:resultDisplay',
      () => {
        setState(mapStuffToState({ model, selectionInterface }))
      }
    )
    listenTo(
      user
        .get('user')
        .get('preferences')
        .get('resultBlacklist'),
      'add remove update reset',
      () => {
        setState(mapStuffToState({ model, selectionInterface }))
      }
    )
    listenTo(
      selectionInterface.getSelectedResults(),
      'update add remove reset',
      () => {
        setState(mapStuffToState({ model, selectionInterface }))
      }
    )
  }, [])
  return (
    <ResultItemRoot
      data-customelement="intrigue-result-item"
      data-resultid={model.id}
      inWorkspace={state.inWorkspace}
      isBlacklisted={state.isBlacklisted}
      isGrid={state.isGrid}
      isWorkspace={state.isWorkspace}
      isResource={state.isResource}
      isRevision={state.isRevision}
      isDeleted={state.isDeleted}
      isDownloadable={state.isDownloadable}
      isLink={state.isLink}
      className={state.isSelected ? 'is-selected' : ''}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <div
        className="result-container"
        data-metacard-id={data.id}
        data-query-id={data.metacard.queryId}
      >
        <MarionetteRegionContainer
          className="container-indicator"
          view={ResultIndicatorView}
          viewOptions={{ model }}
        />
        <div className="container-content">
          <div className="content-header">
            <span
              className="header-icon fa fa-history"
              title="Type: Revision"
              data-help="Indicates the type of result
                          (workspace, resource, history, deleted)"
            />
            <span
              className="header-icon fa fa-book"
              title="Type: Workspace"
              data-help="Indicates the type of result
                          (workspace, resource, history, deleted)"
            />
            <span
              className="header-icon fa fa-file"
              title="Type: Resource"
              data-help="Indicates the type of result
                          (workspace, resource, history, deleted)"
            />
            <span
              className="header-icon fa fa-trash"
              title="Type: Deleted"
              data-help="Indicates the type of result
                          (workspace, resource, history, deleted)"
            />

            <span
              className={`header-icon result-icon ${data.icon}`}
              title="Type: Resource"
              data-help="Indicates the type of result
                          (workspace, resource, history, deleted)"
            />
            <span
              className="header-title"
              data-help={HandleBarsHelpers.getAlias('title')}
              title={`${HandleBarsHelpers.getAlias('title')}: ${
                data.metacard.properties.title
              }`}
            >
              {data.metacard.properties.title}
            </span>
          </div>
          <div className="content-body">
            {renderThumbnail && (
              <MarionetteRegionContainer
                className="detail-thumbnail details-property"
                data-help={HandleBarsHelpers.getAlias('thumbnail')}
                view={HoverPreviewDropdown}
                viewOptions={{
                  model: new DropdownModel(),
                  modelForComponent: model,
                }}
              />
            )}
            {data.customDetail.map((detail: any) => {
              return (
                <div
                  key={detail.label}
                  className="detail-custom details-property"
                  data-help={HandleBarsHelpers.getAlias(detail.label)}
                  title={`${HandleBarsHelpers.getAlias(detail.label)}: ${
                    detail.value
                  }`}
                >
                  <span>{detail.value}</span>
                </div>
              )
            })}
            {data.showRelevanceScore ? (
              <div
                className="detail-custom details-property"
                data-help={`Relevance: ${data.relevance}`}
                title={`Relevance: ${data.relevance}`}
              >
                <span>{data.roundedRelevance}</span>
              </div>
            ) : (
              ''
            )}
            {data.showSource ? (
              <div
                className="detail-source details-property"
                title={`${HandleBarsHelpers.getAlias('source-id')}: ${
                  data.metacard.properties['source-id']
                }`}
                data-help={HandleBarsHelpers.getAlias('source-id')}
              >
                {data.local ? (
                  <React.Fragment>
                    <span className="fa source-icon fa-home" />
                    <span>local</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <span className="fa source-icon fa-cloud" />
                    <span>{data.metacard.properties['source-id']}</span>
                  </React.Fragment>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          <NormalExtensions />
          <Divider />
          <Footer className="content-footer">
            <MarionetteRegionContainer
              className="checkbox-container"
              view={SelectItemToggle}
              viewOptions={{
                model,
                selectionInterface,
              }}
            />
            <div className="result-validation">
              {data.hasError ? (
                <span
                  className="fa fa-exclamation-triangle resultError"
                  title="Has validation errors."
                  data-help="Indicates the given result has a validation error.
                                  See the 'Quality' tab of the result for more details."
                />
              ) : (
                ''
              )}
              {!data.hasError && data.hasWarning ? (
                <span
                  className="fa fa-exclamation-triangle resultWarning"
                  title="Has validation warnings."
                  data-help="Indicates the given result has a validation warning.
                                  See the 'Quality' tab of the result for more details."
                />
              ) : (
                ''
              )}
            </div>
            <div className="result-extension">
              <ButtonExtensions />
            </div>
            <button
              className="result-download fa fa-download is-button is-neutral"
              title="Downloads the associated resource directly to your machine."
              data-help="Downloads
                          the results associated product directly to your machine."
              onClick={e => {
                e.stopPropagation()
                window.open(
                  model
                    .get('metacard')
                    .get('properties')
                    .get('resource-download-url')
                )
              }}
            />
            {renderResultLink(renderResultLinkDropdown, model)}
            <div
              className="result-add"
              onClick={e => e.stopPropagation()}
              title="Add or remove the result from a list, or make a new list with this result."
              data-help="Add or remove the result from a list, or make a new list with this result."
            >
              <Dropdown
                content={() => {
                  return (
                    <MarionetteRegionContainer
                      view={ResultAddView}
                      viewOptions={{
                        model: new Backbone.Collection([model]),
                      }}
                    />
                  )
                }}
              >
                <Button
                  buttonType={buttonTypeEnum.neutral}
                  fadeUntilHover
                  icon="fa fa-plus"
                />
              </Dropdown>
            </div>
            <MetacardInteractionsDropdown
              model={new Backbone.Collection([model])}
            />
          </Footer>
        </div>
      </div>
    </ResultItemRoot>
  )
}

export default hot(module)(ResultItem)
