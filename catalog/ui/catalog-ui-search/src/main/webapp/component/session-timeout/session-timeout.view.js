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
/* global require */
var $ = require('jquery');
var Backbone = require('backbone');
var Marionette = require('marionette');
var CustomElements = require('js/CustomElements');
var template = require('./session-timeout.hbs');
var sessionTimeoutModel = require('component/singletons/session-timeout');
var Common = require('js/Common');

module.exports = Marionette.LayoutView.extend({
    template: template,
    tagName: CustomElements.register('session-timeout'),
    model: null,
    events: {
        'click button': 'renewSession'
    },
    initialize: function (options) {
    },
    onRender: function() {
        setTimeout(this.refreshTimeLeft.bind(this), 1000);
    },
    refreshTimeLeft: function() {
        if (!this.isDestroyed) {
            this.render();
        }
    },
    serializeData: function() {
        var idleTimeoutDate = sessionTimeoutModel.get('idleTimeoutDate');
        var secondsLeft = parseInt((idleTimeoutDate - Date.now())/1000);
        return {
            timeLeft: secondsLeft > 60 ? Common.getMomentDate((sessionTimeoutModel.get('idleTimeoutDate'))) : 'in ' + secondsLeft + ' seconds'
        };
    },
    renewSession: function () {
        sessionTimeoutModel.renew();
    }
});