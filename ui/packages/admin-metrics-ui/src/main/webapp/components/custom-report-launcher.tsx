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
import Button from '@connexta/atlas/atoms/button'
import styled from '@connexta/atlas/styled'
import CustomReport from './custom-report'
const Modal = Material.Core.Modal
const Paper = Material.Core.Paper

const CustomPaper = styled(Paper)`
  width: 400px;
  margin: 100px auto auto auto;
  padding: 20px;
`

const CustomReportLauncher = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div
      style={{
        marginLeft: '20px',
      }}
    >
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Download Custom Report
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <CustomPaper>
          <CustomReport />
        </CustomPaper>
      </Modal>
    </div>
  )
}

export default CustomReportLauncher
