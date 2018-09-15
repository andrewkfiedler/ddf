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
import MarionetteRegionContainer from '../../marionette-region-container'
import withListenTo, { WithBackboneProps } from '../../backbone-container'
import { hot } from 'react-hot-loader'
const PropertyView = require('component/property/property.view')
const PropertyModel = require('component/property/property')

export enum Type {
  autocomplete = 'AUTOCOMPLETE',
  range = 'RANGE',
  date = 'DATE',
  location = 'LOCATION',
  thumbnail = 'BINARY',
  checkbox = 'BOOLEAN',
  number = 'INTEGER',
  geometry = 'GEOMETRY',
  color = 'COLOR',
  inputWithParam = 'NEAR',
  text = 'STRING',
  textarea = 'TEXTAREA',
}

type Props = {
  value?: any[]
  values?: object
  enumeration?: any[]
  label?: string
  description?: string
  readOnly?: boolean
  id?: string
  isEditing?: boolean
  bulk?: boolean
  multivalued?: boolean
  type?: Type
  showValidationIssues?: boolean
  showLabel?: boolean
  initializeToDefault?: boolean
  required?: boolean
  showRequiredWarning?: boolean
  transformValue?: boolean
  param?: string
  placeholder?: string
  url?: string
  minimumInputLength?: number
  min?: number
  max?: number
  units?: string
  enumFiltering?: boolean
  enumCustom?: boolean
  enumMulti?: boolean
  valueTransformer?: (value: any[]) => any
  onChange?: (value: boolean) => void
} & WithBackboneProps

type State = {
  value?: any[]
}

class BasePropertyWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const {
      value = [],
      values = {},
      enumeration,
      label,
      description = '',
      readOnly = false,
      id = '',
      isEditing = true,
      bulk = false,
      multivalued = false,
      type = Type.text,
      showValidationIssues = true,
      showLabel = true,
      initializeToDefault = false,
      required = false,
      showRequiredWarning = false,
      transformValue = true,
      param,
      placeholder = 'Enter a region, country, or city',
      url = './internal/geofeature/suggestions',
      minimumInputLength = 2,
      min = 1,
      max = 100,
      units = '%',
      enumFiltering,
      enumCustom,
      enumMulti,
    } = props
    this.state = {
      value,
    }
    this.propertyModel = new PropertyModel({
      value: this.state.value,
      values,
      enum: enumeration,
      label,
      description,
      readOnly,
      id,
      isEditing,
      bulk,
      multivalued,
      type,
      showValidationIssues,
      showLabel,
      initializeToDefault,
      required,
      showRequiredWarning,
      transformValue,
      param,
      placeholder,
      url,
      minimumInputLength,
      min,
      max,
      units,
      enumFiltering,
      enumCustom,
      enumMulti,
    })
  }
  propertyModel: any
  componentDidMount() {
    if (this.props.onChange !== undefined) {
      this.props.listenTo(
        this.propertyModel,
        'change:value',
        this.modelOnChange.bind(this)
      )
    }
  }
  defaultValueTransformer(value: any[]) {
    return value[0]
  }
  modelOnChange() {
    if (this.props.onChange !== undefined) {
      const transformValue =
        this.props.valueTransformer || this.defaultValueTransformer
      this.props.onChange(transformValue(this.propertyModel.getValue()))
    }
  }
  render() {
    return (
      <MarionetteRegionContainer
        view={PropertyView}
        viewOptions={() => ({
          model: this.propertyModel,
        })}
        replaceElement
      />
    )
  }
}

export default hot(module)(withListenTo(BasePropertyWrapper))
