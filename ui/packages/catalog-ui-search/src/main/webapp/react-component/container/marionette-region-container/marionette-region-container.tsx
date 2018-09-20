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
import * as Marionette from 'backbone.marionette'
import styled from '../../styles/styled-components'
const intervalToCheck = 20
import { hot } from 'react-hot-loader'

type Props = {
  view: any
  viewOptions?: object
  replaceElement?: boolean
  className?: string
  /**
   * If true the component will take up the container it's given.
   */
  gaseous?: boolean
} & React.HTMLProps<HTMLDivElement> &
  JSX.IntrinsicAttributes

const RegionContainer = styled<{ gaseous: boolean }, 'div'>('div')`
  width: ${props => (props.gaseous ? '100%' : 'auto')};
  height: ${props => (props.gaseous ? '100%' : 'auto')};
`
export default hot(module)(
  class MarionetteRegionContainer extends React.Component<Props, {}> {
    constructor(props: Props) {
      super(props)
    }
    checkForElement: number
    region: any
    regionRef = React.createRef()
    showComponentInRegion() {
      if (this.props.view._isMarionetteView) {
        this.region.show(this.props.view, {
          replaceElement: this.props.replaceElement,
        })
      } else {
        this.region.show(new this.props.view(this.props.viewOptions), {
          replaceElement: this.props.replaceElement,
        })
      }
    }
    onceInDOM(callback: () => void) {
      clearInterval(this.checkForElement)
      this.checkForElement = window.setInterval(() => {
        if (document.body.contains(this.regionRef.current as Node)) {
          clearInterval(this.checkForElement)
          callback()
        }
      }, intervalToCheck)
    }
    handleViewChange() {
      this.resetRegion()
      this.onceInDOM(() => {
        this.showComponentInRegion()
      })
    }
    // we might need to update this to account for more scenarios later
    componentDidUpdate(prevProps: Props) {
      if (this.props.view !== prevProps.view) {
        this.handleViewChange()
      }
    }
    componentDidMount() {
      this.onceInDOM(() => {
        this.region = new Marionette.Region({
          el: this.regionRef.current,
        })
        this.showComponentInRegion()
      })
    }
    resetRegion() {
      if (this.region) {
        this.region.empty()
      }
    }
    componentWillUnmount() {
      clearInterval(this.checkForElement)
      if (this.region) {
        this.region.empty()
        this.region.destroy()
      }
    }
    render() {
      const { className, gaseous = true, ...otherProps } = this.props
      return (
        <RegionContainer
          gaseous={gaseous}
          className={`marionette-region-container ${
            className ? className : ''
          }`}
          innerRef={this.regionRef as any}
          {...otherProps as JSX.IntrinsicAttributes}
        />
      )
    }
  }
)
