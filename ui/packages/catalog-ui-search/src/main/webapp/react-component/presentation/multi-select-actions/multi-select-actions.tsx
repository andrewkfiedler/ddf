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
import { hot } from 'react-hot-loader'
import * as React from 'react'
import { Button, buttonTypeEnum } from '../button'
import styled from '../../styles/styled-components'
import plugin from 'plugins/multi-select-actions'

type Props = {
  handleExport: () => void
  isDisabled: boolean
}

const MultiSelectButton = styled(Button)`
  padding: 0px ${props => props.theme.minimumSpacing};
`

type MultiSelectActionProps = {
  isDisabled: Boolean
  onClick: (props: any) => void
  disabledTitle: string
  enabledTitle: string
  icon: string
  text: string
}

export const MultiSelectAction = (props: MultiSelectActionProps) => (
  <MultiSelectButton
    buttonType={buttonTypeEnum.neutral}
    disabled={props.isDisabled ? true : false}
    onClick={
      !props.isDisabled
        ? props.onClick
        : () => {
            return null
          }
    }
    fadeUntilHover
    title={props.isDisabled ? props.disabledTitle : props.enabledTitle}
  >
    <span style={{ paddingRight: '5px' }} className={props.icon} />
    <span>{props.text}</span>
  </MultiSelectButton>
)

const Export = (props: Props) => (
  <MultiSelectAction
    isDisabled={props.isDisabled}
    onClick={props.handleExport}
    disabledTitle="Select one or more results to export."
    enabledTitle="Export selected result(s)."
    icon="fa fa-share"
    text="Export"
  />
)

const buttons = plugin([Export])

const render = (props: Props) => {
  return (
    <div>
      {buttons.map((Component: any, i: number) => (
        <Component key={i} {...props} />
      ))}
    </div>
  )
}

export default hot(module)(render)
