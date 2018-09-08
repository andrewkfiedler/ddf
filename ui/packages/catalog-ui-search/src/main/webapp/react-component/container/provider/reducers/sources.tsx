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
  sources: Sources[]
  amountDown: number
  localCatalog: string
}

const initialState = {
  sources: [],
  amountDown: 0,
  localCatalog: 'ddf.distribution',
}
// @ts-ignore
initialState.sources.localCatalog = initialState.localCatalog // backwards compatibility with old sources model

function sources(state: SourcesState = initialState, action: any) {
  switch (action.type) {
    case 'UPDATE_SOURCES':
      const localCatalog = action.data.localCatalog
      const sources = action.data.toJSON()
      sources.localCatalog = localCatalog // backwards compatibility with old sources model
      const amountDown = sources.filter(function(source: any) {
        return !source.available
      }).length
      return assign({}, state, { sources, amountDown, localCatalog })
    default:
      return state
  }
}

export default sources
