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
import React from 'react'
import styled from '../../styles/styled-components'
import { Button, buttonTypeEnum } from '../button'
import { hot } from 'react-hot-loader'

const EnterKeyCode = 13
const SpaceKeyCode = 32

const CustomElement = styled.div`
  height: 100%;
  width: 100%;
  display: block;
`

const Visualization = styled(Button)`
  width: 100%;
  padding: 0px ${props => props.theme.largeSpacing};
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  > span:first-of-type {
    min-width: ${props => props.theme.minimumButtonSize};
  }
  display: flex;
`

const VisualizationIcon = styled.div`
    text-align: center;
    width: ${props => props.theme.minimumButtonSize}
    display: inline-block;
    vertical-align: middle;
`
const VisualizationText = styled.div`
  width: calc(100% - ${props => props.theme.minimumButtonSize});
  font-size: ${props => props.theme.mediumFontSize};
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
`
const configs = {
  openlayers: {
    title: '2D Map',
    type: 'component',
    componentName: 'openlayers',
    icon: 'fa fa-map',
    componentState: {},
  },
  cesium: {
    title: '3D Map',
    type: 'component',
    componentName: 'cesium',
    icon: 'fa fa-globe',
    componentState: {},
  },
  inspector: {
    title: 'Inspector',
    type: 'component',
    componentName: 'inspector',
    icon: 'fa fa-info',
    componentState: {},
  },
  table: {
    title: 'Table',
    type: 'component',
    componentName: 'table',
    icon: 'fa fa-table',
    componentState: {},
  },
  histogram: {
    title: 'Histogram',
    type: 'component',
    componentName: 'histogram',
    icon: 'fa fa-bar-chart',
    componentState: {},
  },
}

const unMaximize = contentItem => {
  if (contentItem.isMaximised) {
    contentItem.toggleMaximise()
    return true
  } else if (contentItem.contentItems.length === 0) {
    return false
  } else {
    return Array.some(contentItem.contentItems, subContentItem => {
      return unMaximize(subContentItem)
    })
  }
}

class VisualizationSelector extends React.Component {
  dragSources = []
  constructor(props) {
    super(props)
    this.root = React.createRef()
  }
  render() {
    return (
      <CustomElement innerRef={this.root} className="composed-menu">
        {Object.values(configs).map(
          ({ title, icon, componentName }, index) => (
            <Visualization
              onClick={this.handleChoice}
              key={index.toString()}
              innerRef={this[componentName]}
              onMouseDown={() => {
                this.handleMouseDown(componentName)
              }}
              onMouseUp={() => {
                this.handleMouseUp(componentName)
              }}
              onKeyDown={e => {
                this.handleKeyDown(e, componentName)
              }}
              buttonType={buttonTypeEnum.neutral}
              fadeUntilHover
              icon={icon}
              text={title}
              data-component={componentName}
            />
          ),
          this
        )}
      </CustomElement>
    )
  }

  componentDidMount() {
    this.dragSources = []
    this.dragSources = Object.keys(configs).map(key => {
      return this.props.goldenLayout.createDragSource(
        this.root.current.querySelector(`[data-component=${key}]`),
        configs[key]
      )
    })
    this.listenToDragSources()
  }
  listenToDragStart(dragSource) {
    dragSource._dragListener.on('dragStart', () => {
      this.interimState = false
      this.props.onClose()
    })
  }
  listenToDragStop(dragSource) {
    dragSource._dragListener.on('dragStop', () => {
      this.listenToDragStart(dragSource)
      this.listenToDragStop(dragSource)
    })
  }
  listenToDragSources() {
    this.dragSources.forEach(dragSource => {
      this.listenToDragStart(dragSource)
      this.listenToDragStop(dragSource)
    })
  }
  handleChoice = () => {
    this.props.onClose()
  }
  handleKeyDown = (event, choice) => {
    let code = event.keyCode
    if (event.charCode && code == 0) code = event.charCode
    if (
      event.target === event.currentTarget &&
      (code === SpaceKeyCode || code === EnterKeyCode)
    ) {
      event.preventDefault()
      event.stopPropagation()
      this.addChoice(choice)
    }
  }
  addChoice = choice => {
    if (this.props.goldenLayout.root.contentItems.length === 0) {
      this.props.goldenLayout.root.addChild({
        type: 'column',
        content: [configs[choice]],
      })
    } else {
      this.props.goldenLayout.root.contentItems[0].addChild(configs[choice])
    }
    this.handleChoice()
  }
  handleMouseDown = choice => {
    unMaximize(this.props.goldenLayout.root)
    this.interimState = true
  }
  handleMouseUp = choice => {
    if (this.interimState) {
      this.addChoice(choice)
    }
    this.interimState = false
  }
}
export default hot(module)(VisualizationSelector)
