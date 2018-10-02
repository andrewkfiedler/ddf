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
import styled from '../../../react-component/styles/styled-components'
import { hot } from 'react-hot-loader'
import Tabs from '../../../react-component/presentation/tabs'
import Button from '../button'
import Checkbox from '../checkbox'
import Text from '../text'
import Range from '../range'
import DateComponent from '../date'
import Location from '../location'
import Thumbnail from '../thumbnail'
import Geometry from '../geometry'
import NumberComponent from '../number'
import Color from '../color'
import Autocomplete from '../autocomplete'
import Enum from '../enum'
import InputWithParam from '../input-with-param'
import Textarea from '../textarea'
import MultiEnum from '../multi-enum'
const RegionGuideView = require('dev/component/region-guide/region-guide.view')
const CardGuideView = require('dev/component/card-guide/card-guide.view')
const ButtonGuideView = require('dev/component/button-guide/button-guide.view')
const StaticDropdownGuideView = require('dev/component/static-dropdown-guide/static-dropdown-guide.view')
const DropdownGuideView = require('dev/component/dropdown-guide/dropdown-guide.view')
const InputGuideView = require('dev/component/input-guide/input-guide.view')
const JSXGuideView = require('dev/component/jsx-guide/jsx-guide.view')
import MarionetteRegionContainer from '../../../react-component/container/marionette-region-container'

const Root = styled<{}, 'div'>('div')`
  width: 100%;
  height: 100%;
`

const render = () => {
  return (
    <Root>
      <Tabs
        tabs={[
          {
            title: 'Button',
            content: <Button />,
          },
          {
            title: 'Checkbox',
            content: <Checkbox />,
          },
          {
            title: 'Text',
            content: <Text />,
          },
          {
            title: 'Range',
            content: <Range />,
          },
          {
            title: 'Date',
            content: <DateComponent />,
          },
          {
            title: 'Location',
            content: <Location />,
          },
          {
            title: 'Thumbnail',
            content: <Thumbnail />,
          },
          {
            title: 'Geometry',
            content: <Geometry />,
          },
          {
            title: 'NumberComponent',
            content: <NumberComponent />,
          },
          {
            title: 'Color',
            content: <Color />,
          },
          {
            title: 'Autocomplete',
            content: <Autocomplete />,
          },
          {
            title: 'Enum',
            content: <Enum />,
          },
          {
            title: 'Input With Param',
            content: <InputWithParam />,
          },
          {
            title: 'Textarea',
            content: <Textarea />,
          },
          {
            title: 'MultiEnum',
            content: <MultiEnum />,
          },
          {
            title: 'Region Guide',
            content: <MarionetteRegionContainer view={RegionGuideView} />,
          },
          {
            title: 'Card Guide',
            content: <MarionetteRegionContainer view={CardGuideView} />,
          },
          {
            title: 'Button Guide',
            content: <MarionetteRegionContainer view={ButtonGuideView} />,
          },
          {
            title: 'Static Dropdown Guide',
            content: (
              <MarionetteRegionContainer view={StaticDropdownGuideView} />
            ),
          },
          {
            title: 'Dropdown Guide',
            content: <MarionetteRegionContainer view={DropdownGuideView} />,
          },
          {
            title: 'InputGuideView',
            content: <MarionetteRegionContainer view={InputGuideView} />,
          },
          {
            title: 'JSX Guide View',
            content: <MarionetteRegionContainer view={JSXGuideView} />,
          },
        ]}
        gaseous
        sticky
        active="Button"
      />
    </Root>
  )
}

export default hot(module)(render)
