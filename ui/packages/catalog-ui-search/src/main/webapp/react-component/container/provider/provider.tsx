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
const isEqual = require('lodash.isequal')
const _get = require('lodash.get')
const _ = require('underscore')
const sourcesInstance = require('component/singletons/sources-instance2')
const collectionMethods = Object.keys({
  forEach: 3,
  each: 3,
  map: 3,
  collect: 3,
  reduce: 0,
  foldl: 0,
  inject: 0,
  reduceRight: 0,
  foldr: 0,
  find: 3,
  detect: 3,
  filter: 3,
  select: 3,
  reject: 3,
  every: 3,
  all: 3,
  some: 3,
  any: 3,
  include: 3,
  includes: 3,
  contains: 3,
  invoke: 0,
  max: 3,
  min: 3,
  toArray: 1,
  size: 1,
  first: 3,
  head: 3,
  take: 3,
  initial: 3,
  rest: 3,
  tail: 3,
  drop: 3,
  last: 3,
  without: 0,
  difference: 0,
  indexOf: 3,
  shuffle: 1,
  lastIndexOf: 3,
  isEmpty: 1,
  chain: 1,
  sample: 3,
  partition: 3,
  groupBy: 3,
  countBy: 3,
  sortBy: 3,
  indexBy: 3,
  findIndex: 3,
  findLastIndex: 3,
})

const BackboneModel = new Backbone.Model({})
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
  return unsubscribe
}

BackboneModel.listenTo(sourcesInstance, 'all', () => {
  store.dispatch({
    type: 'UPDATE_SOURCES',
    data: sourcesInstance,
  })
})
store.dispatch({
  type: 'UPDATE_SOURCES',
  data: sourcesInstance,
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

class ListenableStore {
  path = undefined
  observers = {} as any
  constructor(path: any) {
    this.path = path
    collectionMethods.forEach(method => {
      // @ts-ignore
      this[method] = this[method].bind(this)
    })
  }
  toJSON() {
    return _get(store.getState(), this.path)
  }
  on(name: any, callback: any, context: any) {
    console.log(name)
    if (this.observers[context.cid] !== undefined) {
      console.log('already listening')
    } else {
      this.observers[context.cid] = observeStore((storeRef: Object) => {
        return _get(storeRef, this.path)
      }, callback.bind(context))
    }
  }
  off(name: any, callback: any, context: any) {
    console.log(name + callback)
    this.observers[context.cid]()
  }
  get() {}
}

// emulate backbone collections
collectionMethods.forEach(method => {
  // @ts-ignore
  ListenableStore.prototype[method] = function() {
    // @ts-ignore
    console.log(this)
    return _[method].apply(
      null,
      // @ts-ignore
      [_get(store.getState(), this.path)].concat(Array.from(arguments))
    )
  }
})

export { store, observeStore, ListenableStore }
export default ProviderContainer
