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
import { expect } from 'chai'
import React from 'react'
<<<<<<< HEAD
import { mount } from 'enzyme'
import { testComponent as MapSettings } from './map-settings'

describe('Test <MapSettings> component', () => {
=======
import { shallow, mount } from 'enzyme'
import { testComponent as MapSettings } from './map-settings'

describe('Test <MapSettings> component', () => {

>>>>>>> 6cbb6a2d9c6db8c4d0411ff5ddfceb47394ff4ad
  it('Test <MapSettings> default rendering', () => {
    const wrapper = mount(<MapSettings />)
    expect(wrapper.contains('Settings')).to.equal(true)
  })
})
