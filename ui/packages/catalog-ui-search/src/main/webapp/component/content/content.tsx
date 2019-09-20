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
import MultiSelectActions from '../../react-component/multi-select-actions'
import styled from 'styled-components'
import { ChangeBackground } from '../../react-component/styles/mixins/change-background'
import { useBackbone } from '../../hooks'
import MarionetteRegionContainer from '../../react-component/marionette-region-container'
import LoadingCompanion from '../../react-component/loading-companion'
import { hot } from 'react-hot-loader'
const WorkspaceContentTabs = require('../tabs/workspace-content/tabs-workspace-content.js')
const WorkspaceContentTabsView = require('../tabs/workspace-content/tabs-workspace-content.view.js')
const store = require('../../js/store.js')
const GoldenLayoutView = require('../golden-layout/golden-layout.view.js')

const ContentLeft = styled.div`
  ${props => {
    return ChangeBackground(props.theme.backgroundAccentContent)
  }};
  border-right: 1px solid
    fade(contrast(${props => props.theme.backgroundAccentContent}), 5%);
  width: calc(9.55 * ${props => props.theme.minimumButtonSize});
  left: 0%;
  top: 0%;
  transition: width ${props => props.theme.coreTransitionTime} ease-in-out;
  position: absolute;
  height: 100%;
  vertical-align: top;
  overflow: hidden;
`

const ContentRight = styled.div`
  width: calc(100% - 9.55 * ${props => props.theme.minimumButtonSize});
  transition: width ${props => props.theme.coreTransitionTime} ease-in-out;
  right: 0%;
  top: 0%;
  position: absolute;
  height: 100%;
  vertical-align: top;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
const Visualizations = styled.div`
  ${props => {
    return ChangeBackground(props.theme.backgroundContent)
  }};
  flex: 1;
`

const Root = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: @zIndexContent;
`

const Content = () => {
  const { listenTo, stopListening, listenToOnce } = useBackbone()
  const mapView = new GoldenLayoutView({
    selectionInterface: store.get('content'),
    configName: 'goldenLayout',
  })
  const [currentWorkspace, setCurrentWorkspace] = React.useState(
    store.get('content').get('currentWorkspace')
  )
  const [isPartial, setIsPartial] = React.useState(currentWorkspace.isPartial())
  React.useEffect(() => {
    listenToOnce(currentWorkspace, 'partialSync', () => {
      setIsPartial(currentWorkspace.isPartial())
    })
    if (currentWorkspace.isPartial()) {
      currentWorkspace.fetchPartial()
    }
    return () => {
      stopListening(currentWorkspace)
    }
  })
  React.useEffect(() => {
    return () => {
      listenTo(
        store.get('content'),
        'change:currentWorkspace',
        (contentModel: any) => {
          if (
            contentModel &&
            Object.keys(contentModel.changedAttributes()).some(
              key => key === 'currentWorkspace'
            )
          ) {
            setCurrentWorkspace(store.get('content').get('currentWorkspace'))
          }
        }
      )
    }
  }, [])

  return (
    <Root>
      <LoadingCompanion loading={isPartial}>
        {isPartial ? null : (
          <>
            <ContentLeft className="content-left">
              <MarionetteRegionContainer
                view={
                  new WorkspaceContentTabsView({
                    model: new WorkspaceContentTabs(),
                    selectionInterface: store.get('content'),
                  })
                }
              />
            </ContentLeft>
            <ContentRight>
              <MultiSelectActions selectionInterface={store.get('content')} />
              <Visualizations className="content-right">
                <MarionetteRegionContainer view={mapView} />
              </Visualizations>
            </ContentRight>
          </>
        )}
      </LoadingCompanion>
    </Root>
  )
}

export default hot(module)(Content)
