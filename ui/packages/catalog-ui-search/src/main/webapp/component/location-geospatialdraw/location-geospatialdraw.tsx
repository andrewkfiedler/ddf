import * as React from 'react'
import MRC from '../../react-component/marionette-region-container'
import fetch from '../../react-component/utils/fetch'
import { Location, geoToFilter } from '@connexta/revelio/components/location'
import {
  queryHook,
  Suggestion,
} from '@connexta/revelio/components/location/keyword/props'
import { DrawProvider } from '@connexta/revelio/react-hooks/use-draw-interface'
import {
  geoJSONToGeometryJSON,
  makeEmptyGeometry,
} from 'geospatialdraw/bin/geometry/utilities'
import { POLYGON, LINE } from 'geospatialdraw/bin/shapes/shape'
import { GeometryJSON } from 'geospatialdraw/bin/geometry/geometry'
const store = require('../../js/store.js')
const Common = require('../../js/Common.js')

const isDrawing = () => {
  return store.get('content').get('drawing')
}

const _ = require('underscore')

const Marionette = require('marionette')
const Property = require('../property/property.js')
let PropertyView: new (arg0: { model: any }) => any

const CQLUtils = require('../../js/CQLUtils.js')

const isBasic = (marionetteViewInstance: any): boolean => {
  return marionetteViewInstance.options.onChange === undefined
}

const getFilterValue = (value: any): any => {
  return value
}

type ValueType = {
  type: string
  property: string
  value: string
  geojson?: GeometryJSON
}

/** Todo: Update Geospatial draw to not crash on bad values, but warn and recover */
const transformToValidatedValue = (prevValue: any, value: ValueType): any => {
  if (!value || !value.geojson) {
    return geoToFilter(makeEmptyGeometry(Math.random().toString(), 'Line'))
  }
  if (
    value &&
    value.geojson &&
    value.geojson.bbox &&
    value.geojson.bbox[0] === undefined
  ) {
    return {
      ...value,
      geojson: makeEmptyGeometry(Math.random().toString(), 'Bounding Box'),
    }
  }
  return value
}

const useFeatureQuery = (() => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [data, setData] = React.useState({
    ...makeEmptyGeometry(Math.random().toString(), 'Bounding Box'),
    properties: {
      ...makeEmptyGeometry(Math.random().toString(), 'Bounding Box').properties,
      keyword: '',
    },
  } as GeometryJSON)

  return {
    fetch: id => {
      setLoading(true)
      fetch(`./internal/geofeature?id=${id}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          setData(data)
          setLoading(false)
        })
    },
    data,
    loading,
    error,
  }
}) as queryHook<GeometryJSON, string>

const useSuggestionQuery = (() => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [data, setData] = React.useState([] as Suggestion[])

  return {
    fetch: query => {
      setLoading(true)
      fetch(`./internal/geofeature/suggestions?q=${encodeURIComponent(query)}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          setLoading(false)
          setData(data)
        })
    },
    data,
    loading,
    error,
  }
}) as queryHook<Suggestion[], string>

const isKeyword = (value: any): boolean => {
  return typeof value?.geojson?.properties?.keyword === 'string'
}

const isEqual = (oldValue: any, newValue: any) => {
  const duplicatedOldValue = Common.duplicate(oldValue)
  const duplicatedNewValue = Common.duplicate(newValue)
  if (duplicatedOldValue?.geojson?.properties?.type === 'BoundingBox') {
    delete duplicatedOldValue.geojson.properties.id
    delete duplicatedOldValue.geojson.properties.color
    delete duplicatedOldValue.geojson.properties.shape
    delete duplicatedOldValue.geojson.properties.buffer
  }
  if (duplicatedNewValue?.geojson?.properties?.type === 'BoundingBox') {
    delete duplicatedNewValue.geojson.properties.id
    delete duplicatedNewValue.geojson.properties.color
    delete duplicatedNewValue.geojson.properties.shape
    delete duplicatedNewValue.geojson.properties.buffer
  }
  return _.isEqual(duplicatedOldValue, duplicatedNewValue)
}

/**
 * So this is used in two places.  In the query basic view, where it recieves data in one way, and the query advanced view where it recieves it slightly differently.
 *
 * basic feeds value, advanced feeds value and onChange
 *
 * basic needs a way to get the value back out
 */
export const GeospatialdrawLocationView = Marionette.ItemView.extend({
  template: function() {
    const drawGeo = this.value
      ? this.value.geojson || this.value
      : makeEmptyGeometry('location', LINE)
    drawGeo.properties.id = Math.random()
    if (isBasic(this)) {
      return (
        <DrawProvider>
          <Location
            enableDrawing={false}
            value={drawGeo}
            onChange={function(update: any) {
              if (isDrawing()) {
                return
              }
              const newValue = geoToFilter(update)
              if (isEqual(newValue, this.value)) {
                return
              }
              // @ts-ignore
              this.updateValue(newValue)
              this.regenerateFakePropertyView()
              // @ts-ignore
              this.render()
            }.bind(this)}
            editorProps={{
              line: {},
              polygon: {},
              pointRadius: {},
              bbox: {},
              keyword: {
                useFeatureQuery,
                useSuggestionQuery,
              },
            }}
          />
          {this.fakePropertyView ? <MRC view={this.fakePropertyView} /> : <></>}
        </DrawProvider>
      )
    }

    return <div>Hello</div>
  },
  regenerateFakePropertyView: function() {
    if (this.fakePropertyView) {
      this.stopListening(this.fakePropertyView.model)
    }
    if (isKeyword(this.value)) {
      this.fakePropertyView = undefined
      return
    }
    this.fakePropertyView = new PropertyView({
      model: new Property({
        value: [getFilterValue(this.value)],
        id: 'Location',
        type: 'LOCATION',
      }),
    })
    let propertyViewCallback = undefined
    if (isBasic(this)) {
      propertyViewCallback = () => {
        const newValue = CQLUtils.generateFilter(
          undefined,
          'anyGeo',
          this.fakePropertyView.model.getValue()[0]
        )
        if (isEqual(newValue, this.value)) {
          return
        }
        this.updateValue(newValue)
        this.render()
      }
    }
    this.listenTo(
      this.fakePropertyView.model,
      'change:value',
      propertyViewCallback
    )
  },
  initialize: function() {
    PropertyView = require('../property/property.view.js')
    if (this.options.value === undefined) {
      console.warn('something is wrong')
    }
    this.updateValue(this.options.value)
    // In order to get a draw button
    this.regenerateFakePropertyView()
  },
  updateValue: function(value: any) {
    const validatedValue = transformToValidatedValue(this.value, value)
    // console.log(validatedValue)
    this.value = validatedValue
  },
  value: undefined as any,
})
