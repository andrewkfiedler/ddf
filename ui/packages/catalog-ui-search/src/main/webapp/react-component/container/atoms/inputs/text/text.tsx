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
import Text from '../../../../presentation/atoms/inputs/text'

type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

type State = {
  value: string
}

const mapPropsToState = (props: Props) => {
  const { value = '' } = props
  return { value }
}

class Component extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = mapPropsToState(props)
    this.onChange = this.onChange.bind(this)
  }
  onChange(value: string) {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.value !== prevProps.value) {
      this.setState(mapPropsToState(this.props))
    }
  }
  render() {
    const { placeholder } = this.props
    const { value } = this.state
    return (
      <Text placeholder={placeholder} value={value} onChange={this.onChange} />
    )
  }
}

export default hot(module)(Component)
