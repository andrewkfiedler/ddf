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
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import { devToolsEnhancer } from 'redux-devtools-extension'
const Backbone = require('backbone')
import isEqual from 'lodash.isequal'

const BackboneModel = new Backbone.Model({})
const sources = require('component/singletons/sources-instance')
const oldStore = require('js/store')

const store = createStore(rootReducer, devToolsEnhancer({}))

function observeStore(select: any, onChange: any) {
  let currentState: any

  function handleChange() {
    let nextState = select(store.getState())
    if (!isEqual(nextState, currentState)) {
      currentState = nextState
      onChange(currentState)
    }
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}

BackboneModel.listenTo(sources, 'all', () => {
  store.dispatch({
    type: 'UPDATE_SOURCES',
    data: sources.toJSON(),
  })
})
store.dispatch({
  type: 'UPDATE_STORE',
  data: oldStore.toJSON(),
})
BackboneModel.listenTo(oldStore.get('content'), 'all', () => {
  store.dispatch({
    type: 'UPDATE_STORE',
    data: oldStore.toJSON(),
  })
})
BackboneModel.listenTo(oldStore.get('workspaces'), 'all', () => {
  store.dispatch({
    type: 'UPDATE_STORE',
    data: oldStore.toJSON(),
  })
})

class ProviderContainer extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props)
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export { store, observeStore }
export default ProviderContainer
