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
 * Patch for upgrading from 1.1.2 to later versions
 * So in addition to the changes in the internalOn we've seen, they also
 * accidentally removed multi event mapping syntax (change reset add in a single
 * call).  However, they added it back.  Unfortunately for us, not in a way
 * that backbone associations can reach.  Here is the simplist way to get that
 * functionality back.
 */
const Backbone = require('backbone')
var eventSplitter = /\s+/

const listenTo = Backbone.View.prototype.listenTo

Backbone.View.prototype.listenTo = function(obj, name, callback) {
  if (typeof name !== 'object' && eventSplitter.test(name)) {
    var i = 0,
      names
    // Handle space separated event names by delegating them individually.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      listenTo.call(this, obj, names[i], callback)
    }
  } else {
    listenTo.call(this, obj, name, callback)
  }
  return this
}
