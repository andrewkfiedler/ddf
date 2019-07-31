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
import * as Material from '@connexta/atlas/__ESCAPE_HATCHES_LET_US_KNOW_IF_YOU_USE_THIS/material-ui'
import { MetricExportURLSType, MetricType } from '../app'

const Table = Material.Core.Table
const TableHead = Material.Core.TableHead
const TableCell = Material.Core.TableCell
const TableBody = Material.Core.TableBody
const TableRow = Material.Core.TableRow
const Link = Material.Core.Link

const getPrettyName = (camelCase: string) => {
  return (
    camelCase
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, function(str) {
        return str.toUpperCase()
      })
  )
}

const MetricTable = ({ metrics }: { metrics: MetricType[] }) => {
  return (
    <div
      style={{
        width: '100%',
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            {metrics[0]
              ? Object.keys(metrics[0])
                  .filter(key => key !== 'id')
                  .map(key => {
                    return <TableCell key={key}>{key}</TableCell>
                  })
              : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {metrics.map(metric => {
            return (
              <TableRow key={metric.id}>
                <TableCell>{getPrettyName(metric.id)}</TableCell>
                {Object.keys(metric)
                  .filter(key => key !== 'id')
                  .map(key => {
                    const metricData = metric[key] as MetricExportURLSType
                    return (
                      <TableCell key={key}>
                        <div>
                          {/**
                           // @ts-ignore */}
                          <Link href={metricData.PNG} target="_blank">
                            PNG
                          </Link>
                        </div>
                        <div>
                          {/**
                           // @ts-ignore */}
                          <Link href={metricData.CSV} target="_blank">
                            CSV
                          </Link>
                        </div>
                        <div>
                          {/**
                           // @ts-ignore */}
                          <Link href={metricData.XLS} target="_blank">
                            XLS
                          </Link>
                        </div>
                      </TableCell>
                    )
                  })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default MetricTable
