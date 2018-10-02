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

type Props = {
  children?: JSX.Element
  className?: string
  gaseous?: boolean
}

const Root = styled<{ gaseous?: boolean }, 'div'>('div')`
  width: calc(100% - 2 * ${props => props.theme.minimumSpacing});
  height: ${props => (props.gaseous ? '100%' : 'auto')};
  margin: ${props => props.theme.minimumSpacing};
  overflow: hidden;
  box-shadow: 0px 0px 2px 1px rgba(255, 255, 255, 0.4),
    2px 2px 10px 2px rgba(0, 0, 0, 0.4);
`

const render = (props: Props) => {
  const { children, className, gaseous } = props
  return (
    <Root gaseous={gaseous} className={className}>
      {children}
    </Root>
  )
}

export default hot(module)(render)
