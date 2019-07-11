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
const Backbone = require('backbone')

type backboneModelProps = {
  listenTo: (object: any, events: string, callback: Function) => any
  stopListening: (
    object?: any,
    events?: string | undefined,
    callback?: Function | undefined
  ) => any
  listenToOnce: (object: any, events: string, callback: Function) => any
}

function useBackbone(): backboneModelProps {
  const backboneModel = new Backbone.Model({})
  React.useEffect(() => {
    return () => {
      backboneModel.stopListening()
      backboneModel.destroy()
    }
  }, [])
  return {
    listenTo: backboneModel.listenTo.bind(backboneModel),
    stopListening: backboneModel.stopListening.bind(backboneModel),
    listenToOnce: backboneModel.listenToOnce.bind(backboneModel),
  }
}

export default useBackbone
