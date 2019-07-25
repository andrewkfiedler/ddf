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
 * This is a workaround for the update in https://github.com/jashkenas/backbone/pull/3663/
 * Basically, they decided not to use the native splice method for performance reasons.
 * Unfortunately, the native splice handles NaN and the new version does not.
 * The native splice pretends NaN is 0, so we'll patch it so we can get the same behavior.
 * (this crops up when upgrading to anything beyond 1.2.1, starting in 1.2.2)
 */
const Backbone = require('backbone')

const originalSet = Backbone.Collection.prototype.set
Backbone.Collection.prototype.set = function(models, options) {
  if (options && options.at === Backbone.Collection.prototype.at) {
    return originalSet.call(this, models, {
      at: null,
    })
  } else {
    return originalSet.call(this, models, options)
  }
}
