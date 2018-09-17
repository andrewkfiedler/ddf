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
import styled from '../../../../styles/styled-components'
import { hot } from 'react-hot-loader'

type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const Input = styled<{}, 'input'>('input')`
  width: 100%;
`

const eventToValue = (onChange?: Function) => {
  if (onChange) {
    return (event: React.FormEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value)
    }
  } else {
    return () => null
  }
}

const render = (props: Props) => {
  const { placeholder, value, onChange } = props
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={eventToValue(onChange)}
    />
  )
}

export default hot(module)(render)
