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
import Base, { Type } from '../base'

type Props = {
  label: string
  placeholder: string
  value: string
  url: string
  minimumInputLength: number
  onChange?: (value: boolean) => void
}

export default hot(module)((props: Props) => {
  const {
    value,
    label,
    placeholder = 'Enter a region, country, or city',
    url = './internal/geofeature/suggestions',
    minimumInputLength = 2,
    onChange,
  } = props
  return (
    <Base
      value={[value]}
      label={label}
      placeholder={placeholder}
      url={url}
      minimumInputLength={minimumInputLength}
      type={Type.autocomplete}
      onChange={onChange}
    />
  )
})
