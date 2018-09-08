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
import COLLECTION_METHODS from './backbone.collection'
const _get = require('lodash.get')
const _ = require('underscore')
const isEqual = require('lodash.isequal')
import store from './store'

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

class ListenableStore {
  path = undefined
  observers = {} as any
  constructor(path: any) {
    this.path = path
    COLLECTION_METHODS.forEach(method => {
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
COLLECTION_METHODS.forEach(method => {
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

export default ListenableStore
