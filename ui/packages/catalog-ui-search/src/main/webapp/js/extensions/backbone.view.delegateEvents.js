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
/**
 * Older versions of backbone called delegate events once after
 * calling initialize.  This just restores that behavior.
 * Without it, certain views didn't have events bound correctly.
 */
const Backbone = require('backbone')

const oldConstructor = Backbone.View.prototype.constructor
Backbone.View = Backbone.View.extend({
  constructor: function(options) {
    oldConstructor.call(this, options)
    this.delegateEvents()
  },
})
