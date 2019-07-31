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
import { hot } from 'react-hot-loader'
import * as React from 'react'
import MetricsTable from './components/table'
import CustomReportLauncher from './components/custom-report-launcher'
import styled, { injectGlobal } from '@connexta/atlas/styled'

injectGlobal`
  html {
    width: 100%;
    height: 100%;
  }
  body, #root {
    margin: 0px;
    width: inherit;
    height: inherit;
  }
  * {
    box-sizing: border-box;
  }
`

const AppRoot = styled.div`
  padding: 20px;
`

export type MetricExportURLSType = {
  PNG: string
  CSV: string
  XLS: string
}

export type MetricFromServerType = {
  '1M': MetricExportURLSType
  '1d': MetricExportURLSType
  '1h': MetricExportURLSType
  '1w': MetricExportURLSType
  '1y': MetricExportURLSType
  '3M': MetricExportURLSType
  '6M': MetricExportURLSType
  '15m': MetricExportURLSType
}

export type MetricType = MetricFromServerType & {
  id: string
  [key: string]: string | MetricExportURLSType
}

const Application = () => {
  const [metrics, setMetrics] = React.useState([] as MetricType[])
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    fetch('../../services/internal/metrics/')
      .then(data => data.json())
      .then(data => {
        setMetrics(
          Object.keys(data).map(metricId => {
            const metricData = data[metricId] as MetricFromServerType
            return {
              id: metricId,
              ...metricData,
            }
          })
        )
        setLoading(false)
      })
  }, [])
  return (
    <AppRoot>
      <CustomReportLauncher />
      {loading ? <div>Loading</div> : <MetricsTable metrics={metrics} />}
    </AppRoot>
  )
}

export default hot(module)(Application)
