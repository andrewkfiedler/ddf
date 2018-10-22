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
/*global require*/
var Marionette = require('marionette')
var CustomElements = require('CustomElements')
var wreqr = require('wreqr')
var properties = require('properties')
const $ = require('jquery')
import * as React from 'react'

const visitFragment = fragment =>
  wreqr.vent.trigger('router:navigate', {
    fragment: fragment,
    options: {
      trigger: true,
    },
  })

module.exports = Marionette.LayoutView.extend({
  template(props) {
    return (
      <React.Fragment>
        <button
          className="navigation-choice is-neutral choice-product is-button"
          data-fragment="guide"
        >
          <span className="is-bold">{props.properties.branding} </span>
          <span className="">{props.properties.product}</span>
        </button>
        <div className="is-divider" />
        <div className="navigation-links">
          <button
            className="navigation-choice is-neutral choice-dev is-button"
            data-fragment="guide"
          >
            <span className="fa fa-user-md" />
            <span>Developer</span>
          </button>
        </div>
      </React.Fragment>
    )
  },
  tagName: CustomElements.register('navigator'),
  regions: {
    workspacesIndicator: '.workspaces-indicator',
    workspacesSave: '.workspaces-save',
    extensions: '.navigation-extensions',
  },
  events: {
    'click .navigation-choice': 'handleChoice',
  },
  handleChoice(e) {
    visitFragment($(e.currentTarget).attr('data-fragment'))
    this.closeSlideout()
  },
  closeSlideout: function() {
    this.$el.trigger('closeSlideout.' + CustomElements.getNamespace())
  },
  serializeData: function() {
    return {
      properties: properties,
    }
  },
})
