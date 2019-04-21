// @ts-ignore
import Timeline from '@connexta/atlas/atoms/timeline-picker'
import * as React from 'react'
import styled from '../../../react-component/styles/styled-components'
import {
  Button,
  buttonTypeEnum,
} from '../../../react-component/presentation/button'
const user = require('../../singletons/user-instance.js')
const moment = require('moment-timezone')
import {
  timeYear as year,
  timeMonth as month,
  timeWeek as week,
  timeDay as day,
  timeHour as hour,
  timeMinute as minute,
  timeSecond as second,
} from 'd3-time'
import { timeFormat as format } from 'd3-time-format'

import { hot } from 'react-hot-loader'

var formatMillisecond = format('.%L'),
  formatSecond = format(':%S'),
  formatMinute = format('%I:%M'),
  formatHour = format('%I %p'),
  formatDay = format('%a %d'),
  formatWeek = format('%b %d'),
  formatMonth = format('%B'),
  formatYear = format('%Y')

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
  mode: 'single' | 'range'
  onChange?: () => void
}

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
  justify-content: center;
`

const CustomButton = styled(Button)`
  padding: 0px ${props => props.theme.minimumSpacing};
`

const tickFormat = (value: string) => {
  const date = user.getUserReadableDateTime(value)
  let momentDate = moment.tz(value, getTimeZone())
  momentDate = momentDate.clone().subtract(momentDate.utcOffset(), 'minutes')
  console.log(getDateFormat)
  console.log(getTimeZone)
  console.log(date)
  console.log(moment)
  let formattedValue
  if (second(value) < value) {
    formattedValue = formatMillisecond(value)
  } else if (minute(value) < value) {
    formattedValue = formatSecond(value)
  } else if (hour(value) < value) {
    //debugger;
    moment.tz(value, getTimeZone()).format('HH:mm')
    formattedValue = formatMinute(value)
  } else if (day(value) < value) {
    //debugger
    moment.tz(value, getTimeZone()).format('h A')
    formattedValue = formatHour(value)
  } else if (month(value) < value) {
    if (week(value) < value) {
      ///debugger
      moment.tz(value, getTimeZone()).format('ddd D')
      formattedValue = formatDay(value)
    } else {
      //debugger
      moment.tz(value, getTimeZone()).format('MMM D')
      formattedValue = formatWeek(value)
    }
  } else if (year(value) < value) {
    //debugger
    moment.tz(value, getTimeZone()).format('MMMM')
    formattedValue = formatMonth(value)
  } else {
    //debugger
    moment.tz(value, getTimeZone()).format('YYYY')
    formattedValue = formatYear(value)
  }
  if (second(value) < value) {
    formattedValue = formatMillisecond(value)
  } else if (minute(value) < value) {
    formattedValue = formatSecond(value)
  } else if (hour(value) < value) {
    formattedValue = moment.tz(value, getTimeZone()).format('HH:mm')
  } else if (day(value) < value) {
    formattedValue = moment.tz(value, getTimeZone()).format('h A')
  } else if (month(value) < value) {
    console.log(month(value))
    if (week(value) < value) {
      formattedValue = moment.tz(value, getTimeZone()).format('ddd D')
    } else {
      formattedValue = moment.tz(value, getTimeZone()).format('MMM D')
    }
  } else if (year(value) < value) {
    formattedValue = moment.utc(value, getTimeZone()).format('MMMM')
  } else {
    formattedValue = moment.utc(value, getTimeZone()).format('YYYY')
  }
  if (
    momentDate
      .clone()
      .startOf('second')
      .isBefore(momentDate)
  ) {
    formattedValue = formatMillisecond(value)
  } else if (
    momentDate
      .clone()
      .startOf('minute')
      .isBefore(momentDate)
  ) {
    formattedValue = formatSecond(value)
  } else if (
    momentDate
      .clone()
      .startOf('hour')
      .isBefore(momentDate)
  ) {
    formattedValue = moment.tz(value, getTimeZone()).format('HH:mm')
  } else if (
    momentDate
      .clone()
      .startOf('day')
      .isBefore(momentDate)
  ) {
    formattedValue = moment.tz(value, getTimeZone()).format('h A')
  } else if (
    momentDate
      .clone()
      .startOf('month')
      .isBefore(momentDate)
  ) {
    if (
      momentDate
        .clone()
        .startOf('week')
        .isBefore(momentDate)
    ) {
      formattedValue = moment.tz(value, getTimeZone()).format('ddd D')
    } else {
      formattedValue = moment.utc(value, getTimeZone()).format('MMM D')
    }
  } else if (
    momentDate
      .clone()
      .startOf('year')
      .isBefore(momentDate)
  ) {
    formattedValue = moment.utc(value, getTimeZone()).format('MMMM')
  } else {
    formattedValue = moment.utc(value, getTimeZone()).format('YYYY')
  }
  return formattedValue
}

class CompoundTimeline extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: undefined,
      hover: undefined,
    }
  }

  render() {
    let value = moment.tz(this.state.value, getTimeZone())
    value = value
      .clone()
      .subtract(value.utcOffset(), 'minutes')
      .format(getDateFormat())
    let hover = moment.tz(this.state.hover, getTimeZone())
    hover = hover
      .clone()
      .subtract(hover.utcOffset(), 'minutes')
      .format(getDateFormat())
    return (
      <Root>
        <div style={{ whiteSpace: 'nowrap' }}>Hover: {hover}</div>
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
          tickFormat={this.props.normal ? undefined : tickFormat}
          ticks={6}
        />
        <div style={{ whiteSpace: 'nowrap' }}>Value: {value}</div>
        <div style={{ whiteSpace: 'nowrap' }}>Value: {this.state.hover}</div>
        <Footer>
          <CustomButton buttonType={buttonTypeEnum.neutral} text="Exit" />
          <CustomButton buttonType={buttonTypeEnum.primary} text="Done" />
        </Footer>
      </Root>
    )
  }
}

export default hot(module)(CompoundTimeline)
