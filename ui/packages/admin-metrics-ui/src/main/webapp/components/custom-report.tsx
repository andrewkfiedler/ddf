/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import * as moment from 'moment'
import * as Material from '@connexta/atlas/__ESCAPE_HATCHES_LET_US_KNOW_IF_YOU_USE_THIS/material-ui'
import Button from '@connexta/atlas/atoms/button'
import styled from '@connexta/atlas/styled'

const LineElement = styled.div`
  display: flex;
  align-items: center;
`

const Select = Material.Core.Select
const MenuItem = Material.Core.MenuItem
const FormControl = Material.Core.FormControl

type choiceType = {
  label: string
  value: string
}

const choices = {
  last: [
    { label: 'last', value: '1' },
    { label: 'last two', value: '2' },
    { label: 'last three', value: '3' },
    { label: 'last six', value: '6' },
  ],
  units: [
    { label: 'hour', value: 'hour' },
    { label: 'day', value: 'day' },
    { label: 'week', value: 'week' },
    { label: 'month', value: 'month' },
    { label: 'year', value: 'year' },
  ],
  unitsPlural: [
    { label: 'hours', value: 'hour' },
    { label: 'days', value: 'day' },
    { label: 'weeks', value: 'week' },
    { label: 'months', value: 'month' },
    { label: 'years', value: 'year' },
  ],
  summarizeBy: [
    { label: 'minutes', value: 'minute' },
    { label: 'hours', value: 'hour' },
    { label: 'days', value: 'day' },
    { label: 'weeks', value: 'week' },
    { label: 'months', value: 'month' },
  ],
}

const calculateDates = ({ last, units }: { last: string; units: string }) => {
  var endDate = moment()
  endDate.utc()
  // @ts-ignore
  endDate.startOf(units)
  var startDate = moment(endDate)
  startDate.utc()
  // @ts-ignore
  startDate.subtract(last, `${units}s`)
  return {
    endDate,
    startDate,
  }
}

const formatDate = (date: any) => {
  return date
    .toDate()
    .toISOString()
    .replace('.000Z', 'Z')
}

type setType<T> = React.Dispatch<React.SetStateAction<T>>

const CustomSelect = ({
  value,
  onChange,
  choices,
}: {
  value: string
  onChange: setType<string>
  choices: choiceType[]
}) => {
  return (
    <FormControl variant="standard" style={{ padding: '10px' }}>
      <Select
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
      >
        {choices.map(choice => {
          return (
            <MenuItem key={choice.value} value={choice.value}>
              {choice.label}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

const CustomReport = () => {
  const [last, setLast] = React.useState(choices.last[0].value)
  const [units, setUnits] = React.useState(choices.units[0].value)
  const [summarizeBy, setSummarizeBy] = React.useState(
    choices.summarizeBy[0].value
  )

  return (
    <div>
      <LineElement>
        Report for the
        {
          <CustomSelect
            value={last}
            onChange={setLast}
            choices={choices.last}
          />
        }
        {
          <CustomSelect
            value={units}
            onChange={setUnits}
            choices={
              last !== choices.last[0].value
                ? choices.unitsPlural
                : choices.units
            }
          />
        }
      </LineElement>
      <LineElement>
        summarized by
        {
          <CustomSelect
            value={summarizeBy}
            onChange={setSummarizeBy}
            choices={choices.summarizeBy}
          />
        }
      </LineElement>
      <div style={{ marginTop: '10px' }}>
        <Button
          emphasis="high"
          color="primary"
          onClick={() => {
            const { startDate, endDate } = calculateDates({ last, units })
            window.open(
              `../../services/internal/metrics/report.xls?startDate=${formatDate(
                startDate
              )}&endDate=${formatDate(endDate)}&summaryInterval=${summarizeBy}`
            )
          }}
        >
          Download
        </Button>
      </div>
    </div>
  )
}

export default CustomReport
