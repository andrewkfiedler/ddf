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
import { Button, buttonTypeEnum } from '../../../button'
const $ = require('jquery')
require('eonasdan-bootstrap-datetimepicker')
import { hot } from 'react-hot-loader'

type Props = {
  placeholder?: string
  value?: string
  format: string
  timezone: string
  onChange?: (value: string) => void
}

const Root = styled<{}, 'div'>('div')`
  width: 100%;
  display: flex;
`

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

const dpEventToValue = (onChange?: Function) => {
  if (onChange) {
    return (event: any) => {
      onChange(event.date.toISOString())
    }
  } else {
    return () => null
  }
}

class Component extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props)
  }
  rootRef = React.createRef<HTMLDivElement>()
  inputRef = React.createRef<HTMLInputElement>()
  componentDidMount() {
    $(this.rootRef.current).datetimepicker({
      format: this.props.format,
      timeZone: this.props.timezone,
      widgetParent: 'body',
      keyBinds: null,
    })
    $(this.rootRef.current).on(
      'dp.change',
      (event: React.FormEvent<HTMLInputElement>) =>
        dpEventToValue(this.props.onChange)(event)
    )
    $(this.rootRef.current).on('dp.show', this.updatePosition.bind(this))
  }
  onClick() {
    const datetimepicker = $(this.rootRef.current).data('DateTimePicker')
    if (datetimepicker) {
      datetimepicker.show()
    }
  }
  componentWillUnmount() {
    const datetimepicker = $(this.rootRef.current).data('DateTimePicker')
    if (datetimepicker) {
      datetimepicker.destroy()
    }
  }
  updatePosition() {
    if (this.inputRef.current === null) {
      return
    }
    let datepicker = $('body').find('.bootstrap-datetimepicker-widget:last')
    let inputCoordinates = this.inputRef.current.getBoundingClientRect()
    let top = datepicker.hasClass('bottom')
      ? inputCoordinates.top + inputCoordinates.height
      : inputCoordinates.top - datepicker.outerHeight()
    datepicker.css({
      top: top + 'px',
      bottom: 'auto',
      left: inputCoordinates.left + 'px',
      width: inputCoordinates.width + 'px',
    })
  }
  render() {
    const { placeholder, value = '', onChange } = this.props
    return (
      <Root innerRef={this.rootRef}>
        <Input
          innerRef={this.inputRef}
          placeholder={placeholder}
          value={value}
          onChange={eventToValue(onChange)}
        />
        <Button
          buttonType={buttonTypeEnum.primary}
          icon="fa fa-calendar"
          onClick={this.onClick.bind(this)}
        />
      </Root>
    )
  }
}

export default hot(module)(Component)
