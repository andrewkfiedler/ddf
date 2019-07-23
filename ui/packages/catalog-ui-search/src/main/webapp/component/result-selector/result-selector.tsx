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

import * as React from 'react'
import ResultStatus from '../result-status/result-status'
const Common = require('../../js/Common.js')
const PagingView = require('../paging/paging.view.js')
const ResultFilterDropdownView = require('../dropdown/result-filter/dropdown.result-filter.view.js')
const DropdownModel = require('../dropdown/dropdown.js')
const cql = require('../../js/cql.js')
const ResultSortDropdownView = require('../dropdown/result-sort/dropdown.result-sort.view.js')
const user = require('../singletons/user-instance.js')
require('../../behaviors/selection.behavior.js')
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'
import ResultItemCollection from '../result-item/result-item.collection'
import Spellcheck from '../spellcheck/index'
import { hot } from 'react-hot-loader'
import { useBackbone } from '../../hooks/index'
import Dropdown from '../../react-component/presentation/dropdown'
import NavigationBehavior from '../../react-component/presentation/navigation-behavior'
import MenuSelection from '../../react-component/presentation/menu-selection'
import styled from '../../react-component/styles/styled-components'

const {
  SelectAllToggle,
} = require('../selection-checkbox/selection-checkbox.view.js')

const IconSpan = styled.span`
  display: inline-block;
  padding-right: ${props => props.theme.minimumSpacing};
  text-align: center;
`

function mixinBlackListCQL(originalCQL: any) {
  const blackListCQL = {
    filters: [
      {
        filters: user
          .get('user')
          .get('preferences')
          .get('resultBlacklist')
          .map((blacklistItem: any) => ({
            property: '"id"',
            type: '!=',
            value: blacklistItem.id,
          })),
        type: 'AND',
      },
    ],
    type: 'AND',
  }
  if (originalCQL) {
    blackListCQL.filters.push(originalCQL)
  }
  return blackListCQL
}

const ResultSelectorRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0px ${props => props.theme.minimumSpacing};
  display: flex;
  flex-direction: column;
  .paging .status {
    text-align: center;
    opacity: ${props => props.theme.minimumOpacity};
  }

  .resultSelector-list {
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .resultSelector-menu {
    position: relative;
    text-align: left;
    margin-left: calc(2 * ${props => props.theme.minimumSpacing});
    white-space: nowrap;
    > div {
      display: inline-block;
    }
    height: ${props => props.theme.minimumButtonSize};
    line-height: ${props => props.theme.minimumButtonSize};
  }

  .resultSelector-menu-action > * {
    height: ${props => props.theme.minimumButtonSize};
    line-height: ${props => props.theme.minimumButtonSize};
  }

  .resultSelector-menu-action {
    margin-left: ${props => props.theme.largeSpacing};
  }
`

const mergeNewResults = (model: any) => {
  model.get('result').mergeNewResults()
}
const prefs = user.get('user').get('preferences')

type Props = {
  model: any
  selectionInterface: any
  tieredSearchIds?: any
}

const calculateResults = ({ model }: { model: any }) => {
  let resultFilter = user
    .get('user')
    .get('preferences')
    .get('resultFilter')
  if (resultFilter) {
    resultFilter = cql.simplify(cql.read(resultFilter))
  }
  resultFilter = mixinBlackListCQL(resultFilter)
  const filteredResults = model
    .get('result')
    .get('results')
    .generateFilteredVersion(resultFilter)
  const collapsedResults = filteredResults.collapseDuplicates()
  collapsedResults.updateSorting(
    user
      .get('user')
      .get('preferences')
      .get('resultSort')
  )
  return collapsedResults
}

const ResultDisplayDropdown = () => {
  const [resultDisplay, setResultDisplay] = React.useState(prefs.get(
    'resultDisplay'
  ) as string)
  const { listenTo } = useBackbone()
  React.useEffect(() => {
    listenTo(prefs, 'change:resultDisplay', () => {
      setResultDisplay(prefs.get('resultDisplay'))
    })
  }, [])
  return (
    <Dropdown
      content={context => {
        return (
          <NavigationBehavior>
            <MenuSelection
              onClick={() => {
                if (resultDisplay !== 'List') {
                  prefs.set('resultDisplay', 'List')
                  prefs.savePreferences()
                }
                context.closeAndRefocus()
              }}
              isSelected={resultDisplay !== 'Grid'}
            >
              <IconSpan className="fa fa-bars" />
              List
            </MenuSelection>
            <MenuSelection
              onClick={() => {
                if (resultDisplay !== 'Grid') {
                  prefs.set('resultDisplay', 'Grid')
                  prefs.savePreferences()
                }
                context.closeAndRefocus()
              }}
              isSelected={resultDisplay === 'Grid'}
            >
              <IconSpan className="fa fa-picture-o" />
              Gallery
            </MenuSelection>
          </NavigationBehavior>
        )
      }}
    >
      <IconSpan
        className={`fa ${
          resultDisplay === 'Grid' ? 'fa-picture-o' : 'fa-bars'
        }`}
      />
      <span>{resultDisplay === 'Grid' ? 'Gallery' : 'List'}</span>
    </Dropdown>
  )
}

const MergeComponentRoot = styled<
  {
    hasUnmerged: boolean
    ignoreNew: boolean
  },
  'div'
>('div')`
  background: ${props => props.theme.backgroundDropdown};
  position: absolute;
  width: calc(100% - 2 * ${props => props.theme.minimumSpacing});
  z-index: 1;
  margin: 0px ${props => props.theme.minimumSpacing};
  left: 0px;
  white-space: nowrap;

  .merge {
    width: calc(100% - ${props => props.theme.minimumButtonSize});
    > span {
      font-size: ${props => props.theme.mediumFontSize};
    }
  }

  .ignore {
    width: ${props => props.theme.minimumButtonSize};
  }

  transform: ${props =>
    !props.ignoreNew && props.hasUnmerged ? 'scale(1)' : 'scale(0)'};
  transition: transform ${props => props.theme.coreTransitionTime} ease-out
    ${props => (!props.ignoreNew && props.hasUnmerged ? '3s' : '0s')};
`

const MergeComponent = ({ model }: { model: any }) => {
  const [hasUnmerged, setHasUnmerged] = React.useState(model
    .get('result')
    .isUnmerged() as boolean)
  const [ignoreNew, setIgnoreNew] = React.useState(false)
  const { listenTo } = useBackbone()
  React.useEffect(() => {
    listenTo(model.get('result'), 'change:merged', () => {
      setIgnoreNew(false)
      setHasUnmerged(model.get('result').isUnmerged())
    })
  }, [])
  return (
    <MergeComponentRoot hasUnmerged={hasUnmerged} ignoreNew={ignoreNew}>
      <button
        className="is-positive merge"
        onClick={() => {
          mergeNewResults(model)
        }}
      >
        <span>Update with new data?</span>
      </button>
      <button
        className="is-negative ignore"
        onClick={() => {
          setIgnoreNew(true)
        }}
      >
        <span className="fa fa-times" />
      </button>
    </MergeComponentRoot>
  )
}

const IsSearchingComponentRoot = styled<{ isSearching: boolean }, 'div'>('div')`
  overflow: hidden;
  position: absolute;
  width: ${props => props.theme.minimumSpacing};
  top: ${props => props.theme.minimumButtonSize};
  height: calc(100% - 2 * ${props => props.theme.minimumButtonSize} - 10px);
  z-index: 1;
  left: calc(100% - 0.5 * ${props => props.theme.minimumSpacing});

  opacity: ${props => (props.isSearching ? '1' : '0')};
  transition: opacity
    ${props => props.theme.multiple(10, props.theme.coreTransitionTime, 's')}
    ease-out;
`

const SearchingBit = styled<{ delay: number }, 'div'>('div')`
  content: '';
  width: 100%;
  position: absolute;
  left: 0px;
  border-top: ${props => props.theme.largeSpacing} solid;
  top: calc(-${props => props.theme.largeSpacing});
  height: 100%;
  animation: result-selector-is-searching
    ${props => props.theme.multiple(10, props.theme.coreTransitionTime, 's')}
    infinite ease-in-out;
  animation-delay: ${props =>
    props.theme.multiple(props.delay, props.theme.coreTransitionTime, 's')};
`

const IsSearchingComponent = ({ model }: { model: any }) => {
  const { listenTo } = useBackbone()
  const [isSearching, setIsSearching] = React.useState(model
    .get('result')
    .isSearching() as boolean)
  React.useEffect(() => {
    listenTo(model.get('result'), 'sync request error', () => {
      setIsSearching(model.get('result').isSearching())
    })
  }, [])
  return (
    <IsSearchingComponentRoot
      isSearching={isSearching}
      className="is-critical-animation"
    >
      <SearchingBit delay={1} className="is-critical-animation" />
      <SearchingBit delay={2} />
      <SearchingBit delay={3} />
      <SearchingBit delay={4} />
      <SearchingBit delay={5} />
    </IsSearchingComponentRoot>
  )
}

const ResultSelector = (props: Props) => {
  const { model, selectionInterface, tieredSearchIds } = props
  const { listenTo } = useBackbone()

  if (!model.get('result')) {
    if (tieredSearchIds !== undefined) {
      model.startTieredSearch(tieredSearchIds)
    } else {
      model.startSearch()
    }
  }
  const [results, setResults] = React.useState(calculateResults({ model }))
  const [isResultCountOnly, setIsResultCountOnly] = React.useState(model
    .get('result')
    .get('resultCountOnly') as boolean)
  React.useEffect(() => {
    model.get('result').set('currentlyViewed', true)
    selectionInterface.setCurrentQuery(model)

    listenTo(prefs, 'change:resultFilter change:resultSort', () => {
      setResults(calculateResults({ model }))
    })
    listenTo(model.get('result'), 'reset:results', () => {
      setResults(calculateResults({ model }))
    })
    listenTo(model.get('result'), 'change:resultCountOnly', () => {
      setIsResultCountOnly(model.get('result').get('resultCountOnly'))
    })
    return () => {
      Common.queueExecution(() => {
        if (model.get('result')) {
          model.get('result').set('currentlyViewed', false)
        }
      })
    }
  }, [])

  if (isResultCountOnly) {
    return null
  }
  return (
    <ResultSelectorRoot>
      <div className="resultSelector-menu">
        <div className="checkbox-container">
          <MarionetteRegionContainer
            view={
              new SelectAllToggle({
                selectionInterface,
              })
            }
          />
        </div>
        <div className="resultSelector-menu-action menu-resultFilter">
          <MarionetteRegionContainer
            view={
              new ResultFilterDropdownView({
                model: new DropdownModel(),
              })
            }
          />
        </div>
        <div className="resultSelector-menu-action menu-resultSort">
          <MarionetteRegionContainer
            view={
              new ResultSortDropdownView({
                model: new DropdownModel(),
              })
            }
          />
        </div>
        <div className="resultSelector-menu-action menu-resultDisplay">
          <ResultDisplayDropdown />
        </div>
      </div>
      <ResultStatus results={results} />
      <MergeComponent model={model} />
      <IsSearchingComponent model={model} />
      <Spellcheck
        key={Math.random()}
        showingResultsForFields={model
          .get('result')
          .get('showingResultsForFields')}
        didYouMeanFields={model.get('result').get('didYouMeanFields')}
        model={model}
        results={results}
      />
      <ResultItemCollection
        className="resultSelector-list"
        key={Math.random()}
        model={model}
        results={results}
        selectionInterface={selectionInterface}
      />
      <MarionetteRegionContainer
        key={Math.random()}
        className="resultSelector-paging"
        view={PagingView}
        viewOptions={{
          model: results,
          selectionInterface,
        }}
        replaceElement
      />
    </ResultSelectorRoot>
  )
}

export default hot(module)(ResultSelector)
