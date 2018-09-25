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
import { hot } from 'react-hot-loader'
import Portal from '../portal'
import styled from '../../styles/styled-components'
const DropdownBehaviorUtility = require('behaviors/dropdown.behavior.utility')
const $ = require('jquery')

type Props = {
  content: JSX.Element
  className?: string
}
type State = {
  open: boolean
}

const Button = styled<{}, 'button'>('button')`
  min-width: ${props => props.theme.minimumButtonSize};
  opacity: ${props => props.theme.minimumOpacity};

  &:hover {
    opacity: 1;
  }
`

const DropdownWrapper = styled<{ open: boolean }, 'div'>('div')`
  display: block;
  position: absolute;
  z-index: ${props => props.theme.zIndexDropdown};
  overflow: auto;
  background: red;
  padding-top: ${props => props.theme.minimumSpacing};
  padding-bottom: ${props => props.theme.minimumSpacing};
  border-radius: 2px;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  transition: opacity ${props => props.theme.coreTransitionTime} ease-in-out;
  opacity: ${props => (props.open ? 1 : 0)};
  ${props =>
    props.open
      ? `
  transform: translate3d(0, 0, 0) scale(1);
  `
      : `
  transform: translate3d(-50%, -50%, 0) scale(0);
  `};
`

class Dropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: false,
    }
    this.bindFunctions()
  }
  bindFunctions() {
    this.onClick = this.onClick.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.handleOutsideInteraction = this.handleOutsideInteraction.bind(this)
    this.checkOutsideClick = this.checkOutsideClick.bind(this)
    this.withinDropdown = this.withinDropdown.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
  }
  dropdownRef = React.createRef() as React.RefObject<HTMLDivElement>
  sourceRef = React.createRef() as React.RefObject<HTMLButtonElement>
  componentDidMount() {
    this.updatePosition()
    window.addEventListener('resize', this.updatePosition)
    window.addEventListener('mousedown', this.handleOutsideInteraction)
    this.listenForKeydown()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePosition)
    window.removeEventListener('mousedown', this.handleOutsideInteraction)
  }
  handleKeydown(event: KeyboardEvent) {
    let code = event.keyCode
    if (event.charCode && code == 0) code = event.charCode
    // Escape
    if (code === 27) {
      event.preventDefault()
      event.stopPropagation()
      this.close()
      this.refocusOnSource()
    }
  }
  listenForKeydown() {
    if (this.dropdownRef.current) {
      this.dropdownRef.current.addEventListener('keydown', this.handleKeydown)
    }
  }
  componentDidUpdate(_prevProps: Props, prevState: State) {
    this.updatePosition()
    this.handleOpen(prevState)
  }
  handleOpen(prevState: State) {
    if (prevState.open === false && this.state.open === true) {
      this.focus()
    }
  }
  refocusOnSource() {
    if (this.sourceRef.current) {
      this.sourceRef.current.focus()
    }
  }
  focus() {
    if (this.dropdownRef.current) {
      this.dropdownRef.current.focus()
    }
  }
  updatePosition() {
    DropdownBehaviorUtility.updatePosition(
      $(this.dropdownRef.current),
      this.sourceRef.current
    )
  }
  withinDropdown(element: HTMLDivElement) {
    if (!this.sourceRef.current) {
      return false
    }
    return this.sourceRef.current.contains(element)
  }
  checkOutsideClick(clickedElement: any) {
    if (this.withinDropdown(clickedElement)) {
      return
    }
    if (
      DropdownBehaviorUtility.withinDOM(clickedElement) &&
      !DropdownBehaviorUtility.withinAnyDropdown(clickedElement)
    ) {
      this.close()
    }
    if (
      DropdownBehaviorUtility.withinParentDropdown(
        $(this.dropdownRef.current),
        clickedElement
      )
    ) {
      this.close()
    }
  }
  close() {
    this.setState({
      open: false,
    })
  }
  handleOutsideInteraction(event: any) {
    if (!DropdownBehaviorUtility.drawing(event)) {
      this.checkOutsideClick(event.target)
    }
  }
  onClick() {
    this.setState({
      open: !this.state.open,
    })
  }
  onMouseDown() {}
  render() {
    const { className } = this.props
    const { open } = this.state
    return (
      <>
        <Button
          innerRef={this.sourceRef as any}
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          className={className}
        >
          {this.props.children}
        </Button>
        <Portal>
          <DropdownWrapper
            innerRef={this.dropdownRef as any}
            open={open}
            tabIndex={0}
          >
            {this.props.content}
          </DropdownWrapper>
        </Portal>
      </>
    )
  }
}

export default hot(module)(Dropdown)
