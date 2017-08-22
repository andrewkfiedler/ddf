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
/* jshint browser: true */
/* global define */
define([
    'jquery',
    'icanhaz',
    'backbone',
    'js/wreqr',
    'js/views/Modal',
    'properties',
    'text!templates/sessionTimeoutModal.handlebars'
],
function ($, ich, Backbone, wreqr, Modal, properties, sessionTimeoutModalTemplate) {
    ich.addTemplate('sessionTimeoutModalTemplate', sessionTimeoutModalTemplate);

    var _this = null;
    var timer = null;

    var SessionTimeoutModal = Modal.extend({
        template: 'sessionTimeoutModalTemplate',
        model: null,

        ui: {
            logout: "#logoutBtn"
        },

        events: {
            'click @ui.logout': 'logoutUser'
        },

        initialize: function(options) {
            _this = this;
            var msUntilTimeout = options.time;
            this.model = new Backbone.Model({time: Math.ceil(msUntilTimeout / 1000)});

            this.$el.one('hidden.bs.modal', this.refreshSession);
            this.initTimer(msUntilTimeout);
        },

        initTimer: function(msUntilTimeout) {
            var start = Date.now();
            var dateOfTimeout = start + msUntilTimeout;
            var deltaTime = msUntilTimeout % 1000;

            function onInterval() {
                var now = Date.now();

                if (dateOfTimeout > now) {
                    var msRemaining = dateOfTimeout - now;
                    var deltaTime = msRemaining % 1000;

                    $(_this.$el).find('#timer').text(Math.ceil(msRemaining / 1000));
                    timer = setTimeout(onInterval, (deltaTime === 0) ? 1000 : deltaTime);
                }
                else
                    _this.logoutUser();
            }

            timer = setTimeout(onInterval, (deltaTime === 0) ? 1000 : deltaTime);
        },

        logoutUser: function() {
            clearTimeout(timer);
            window.location.replace("/services/session/invalidate?prevurl=" + window.location.pathname);
        },

        refreshSession: function() {
            clearTimeout(timer);
            $.get("/services/session/renew")
                .done(function() {
                    console.log("session renewed");
                    wreqr.vent.trigger("sessionRenewed");
                })
                .fail(function() {
                    console.log("session renewal failed");
                })
                .always(function() {
                    _this.destroy();
                });
        }
    });

    return SessionTimeoutModal;
});