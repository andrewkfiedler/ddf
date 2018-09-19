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
import styled from '../../styles/styled-components'
import { hot } from 'react-hot-loader'

type Tab = {
  title: string
  content: JSX.Element
}

type Props = {
  tabs: Tab[]
  active: string
  vertical?: boolean
  /**
   * Component will behave like a gas and fill it's container
   */
  gaseous?: boolean
  /**
   * Tab buttons will always remain visible.  Sets gaseous to true.
   */
  sticky?: boolean
}

type State = Props & {
  activeWidth: number
  activeLocation: number
  vertical: boolean
  gaseous: boolean
  sticky: boolean
}

const Root = styled<
  { vertical: boolean; gaseous: boolean; sticky: boolean },
  'div'
>('div')`
  width: ${props => (props.gaseous ? '100%' : 'auto')};
  height: ${props => (props.gaseous ? '100%' : 'auto')};
  overflow: auto;
  display: ${props =>
    props.vertical === false && props.sticky === false ? 'block' : 'flex'};
  flex-direction: ${props => (props.vertical ? 'row' : 'column')};
  align-items: ${props => (props.vertical ? 'flex-start' : 'center')};
`

const TabButton = styled<{}, 'button'>('button')`
  display: block;
  opacity: ${props => props.theme.minimumOpacity};
  height: ${props => props.theme.minimumButtonSize};
  min-width: ${props => props.theme.minimumButtonSize};
  padding: 0px ${props => props.theme.mediumSpacing};
`

const ActiveTabButton = styled(TabButton)`
  display: block;
  opacity: 1;
`

const TabsWrapper = styled<{ vertical: boolean; gaseous: boolean }, 'div'>(
  'div'
)`
  display: flex;
  flex-direction: ${props => (props.vertical ? 'column' : 'row')};
  position: relative;
  flex-shrink: 0;
  justify-content: ${props => (props.vertical ? 'flex-start' : 'center')};
  height: ${props => (props.gaseous && props.vertical ? '100%' : 'auto')};
  width: ${props =>
    props.gaseous && props.vertical === false ? '100%' : 'auto'};
`

const TabIndicator = styled<
  { width: number; location: number; vertical: boolean },
  'div'
>('div')`
  display: block;
  width: ${props => props.width}px;
  position: absolute;
  left: 0px;
  top: 100%;
  height: 5px;
  background: ${props => props.theme.primaryColor};
  transform: ${props =>
    `translate${props.vertical ? 'Y' : 'X'}(${props.location}px)`};
  transition: transform ${props => props.theme.coreTransitionTime} ease-in-out;
`

const TabContent = styled<{ gaseous: boolean; sticky: boolean }, 'div'>('div')`
  display: block;
  width: ${props => (props.gaseous ? '100%' : 'auto')};
  height: ${props => (props.sticky ? '100%' : 'auto')};
  overflow: ${props => (props.sticky ? 'auto' : 'hidden')};
`

const debounce = (callback: Function) => {
  let timeoutId: any
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(callback, 200)
  }
}

class Tabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    let {
      active = '',
      tabs = [],
      vertical = false,
      gaseous = false,
      sticky = false,
    } = props
    if (sticky) {
      gaseous = true
    }
    this.state = {
      active,
      tabs,
      activeWidth: 0,
      activeLocation: 0,
      vertical,
      gaseous,
      sticky,
    }
  }
  debouncedUpdateTabIndicator = debounce(this.updateTabIndicator.bind(this))
  activeTabRef = React.createRef()
  componentDidMount() {
    this.updateTabIndicator()
    window.addEventListener('resize', this.debouncedUpdateTabIndicator)
  }
  updateTabIndicator() {
    if (this.activeTabRef.current) {
      const current = this.activeTabRef.current as HTMLButtonElement
      const parent = current.parentElement as HTMLDivElement
      const { width, top, left, height } = current.getBoundingClientRect()
      const parentTop = parent.getBoundingClientRect().top
      const parentHeight = parent.getBoundingClientRect().height
      const parentLeft = parent.getBoundingClientRect().left
      this.setState({
        activeWidth: width,
        activeLocation: this.state.vertical
          ? top - parentTop - parentHeight + height
          : left - parentLeft,
      })
    }
  }
  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (this.props.sticky !== _prevProps.sticky) {
      this.setState({
        sticky: this.props.sticky !== undefined ? this.props.sticky : false,
      })
      this.updateTabIndicator()
      return
    }
    if (this.props.vertical !== _prevProps.vertical) {
      this.setState({
        vertical:
          this.props.vertical !== undefined ? this.props.vertical : false,
      })
      this.updateTabIndicator()
      return
    }
    if (this.props.gaseous !== _prevProps.gaseous) {
      this.setState({
        gaseous: this.props.gaseous !== undefined ? this.props.gaseous : false,
      })
      this.updateTabIndicator()
      return
    }
    if (prevState.active === this.state.active) {
      return
    }
    this.updateTabIndicator()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedUpdateTabIndicator)
  }
  render() {
    const {
      tabs,
      active,
      activeWidth,
      activeLocation,
      vertical,
      gaseous,
      sticky,
    } = this.state
    return (
      <Root vertical={vertical} gaseous={gaseous} sticky={sticky}>
        <TabsWrapper vertical={vertical} gaseous={gaseous}>
          {tabs.map(tab => {
            return active === tab.title ? (
              <ActiveTabButton innerRef={this.activeTabRef} key={tab.title}>
                {tab.title}
              </ActiveTabButton>
            ) : (
              <TabButton
                onClick={() => {
                  this.setState({ active: tab.title })
                }}
                key={tab.title}
              >
                {tab.title}
              </TabButton>
            )
          })}
          <TabIndicator
            width={activeWidth}
            location={activeLocation}
            vertical={vertical}
          />
        </TabsWrapper>
        <TabContent gaseous={gaseous} sticky={sticky}>
          {tabs.filter(tab => tab.title === active)[0].content}
        </TabContent>
      </Root>
    )
  }
}

export default hot(module)(Tabs)
