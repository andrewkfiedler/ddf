// @ts-ignore
import Timeline from '@connexta/atlas/atoms/timeline-picker'
import * as React from 'react'
import styled, {
  withTheme,
  ThemeInterface,
} from '../../../react-component/styles/styled-components'
import {
  Button,
  buttonTypeEnum,
} from '../../../react-component/presentation/button'
import withListenTo, {
  WithBackboneProps,
} from '../../../react-component/container/backbone-container'
const user = require('../../singletons/user-instance.js')
const moment = require('moment-timezone')

import { hot } from 'react-hot-loader'

function getDateFormat() {
  return user
    .get('user')
    .get('preferences')
    .get('dateTimeFormat')['datetimefmt']
}

function getTimeZone() {
  return user
    .get('user')
    .get('preferences')
    .get('timeZone')
}

type Props = {
  model: Backbone.Model
  mode: 'single' | 'range'
  onDone?: (value: string) => void
  onCancel?: () => void
  value?: string
  theme: ThemeInterface
} & WithBackboneProps

type State = {
  hover?: string
  value?: string
}

const Root = styled.div`
  width: auto;
  min-width: ${props => props.theme.minimumScreenSize};
  padding: ${props => props.theme.minimumSpacing};
`

const Footer = styled.div`
  margin-top: ${props => props.theme.minimumSpacing};
  display: flex;
  justify-content: space-between;
`

const CustomButton = styled(Button)`
  padding: 0px ${props => props.theme.minimumSpacing};
`

const mapModeltoState = (model: Backbone.Model) => {
  return {
    value: model.get('value')
      ? user.getUserReadableDateTime(model.get('value'))
      : undefined,
  }
}

class CompoundTimeline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      ...mapModeltoState(props.model),
      hover: undefined,
    }
  }
  componentDidMount() {
    this.props.listenTo(
      this.props.model,
      'change:value',
      this.handleChangeValue
    )
  }
  handleChangeValue = () => {
    this.setState(mapModeltoState(this.props.model))
  }
  render() {
    return (
      <Root>
        <div style={{ whiteSpace: 'nowrap' }}>Hover: {this.state.hover}</div>
        <Timeline
          mode="single"
          onChange={value => {
            this.setState({ value })
          }}
          onMouseLeave={() => {
            this.setState({ hover: undefined })
          }}
          onHover={hover => {
            this.setState({ hover })
          }}
          hoverColor={this.props.theme.primaryColor}
          timezone={getTimeZone()}
          format={getDateFormat()}
          ticks={3}
          value={this.state.value}
        />
        <div style={{ whiteSpace: 'nowrap' }}>Value: {this.state.value}</div>
        <Footer>
          <CustomButton
            buttonType={buttonTypeEnum.neutral}
            text="Cancel"
            onClick={() => {
              if (this.props.onCancel) {
                this.props.onCancel()
                this.handleChangeValue()
              }
            }}
          />
          <CustomButton
            buttonType={buttonTypeEnum.primary}
            text="Done"
            onClick={() => {
              if (this.props.onDone) {
                this.props.onDone(this.state.value || '')
              }
            }}
          />
        </Footer>
      </Root>
    )
  }
}

export default hot(module)(withListenTo(withTheme(CompoundTimeline)))
