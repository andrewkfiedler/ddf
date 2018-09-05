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

const assign = require('lodash.assign')

type Source = {
  available: boolean
  contentTypes: any[]
  id: string
  local: boolean
  sourceActions: any[]
  version: string
}

type Sources = Source[]

type SourcesState = {
  list: Sources[]
  amountDown: number
}

const initialState = {
  list: [],
  amountDown: 0,
}

function sources(state: SourcesState = initialState, action: any) {
  switch (action.type) {
    case 'UPDATE_SOURCES':
      const amountDown = action.data.filter(function(source: any) {
        return !source.available
      }).length
      return assign({}, state, { list: action.data, amountDown })
    default:
      return state
  }
}

export default sources
