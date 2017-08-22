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
/* jshint browser: true */
/* global define */
define(['jquery',
        'underscore',
        'marionette',
        'js/wreqr',
        'js/views/SessionTimeoutModal.view'
    ], function($, _, Marionette, wreqr, SessionTimeoutModal) {
        'use strict';
        var SessionTimeoutController;

        var _this = null;
        var idleNoticeDuration = 60000;
        var idleTimeoutThreshold = 900000;  // Length of inactivity that will trigger user timeout
                                            // See STIG V-69243

        SessionTimeoutController = Marionette.Controller.extend({
            initialize: function() {
                _this = this;
                _this.initTimer();

                wreqr.vent.on("sessionRenewed", _this.initTimer);
            },

            initTimer: function() {
                var timer = null;
                var start = Date.now();
                var sessionRenewDate = 0;
                var idleTimeoutDate = idleTimeoutThreshold - idleNoticeDuration + Date.now();

                function setSessionRenewDate() {
                    $.get("/services/session/expiry", function(res) {
                        var msUntilTimeout = parseInt(res);
                        if (msUntilTimeout === 0)
                            clearTimeout(timer);

                        var msUntilAutoRenew = Math.max(msUntilTimeout * 0.7, msUntilTimeout - 60000);
                        sessionRenewDate = Date.now() + msUntilAutoRenew;
                    });
                }

                function onInterval() {
                    var now = Date.now();

                    if (now >= sessionRenewDate) {
                        $.get("/services/session/renew", function() {
                            console.log("session renewed");
                            setSessionRenewDate();
                        });
                    }

                    if (now >= idleTimeoutDate) {
                        $(document).off('keydown mousedown scroll');
                        wreqr.vent.trigger('showModal', new SessionTimeoutModal({
                            time: idleNoticeDuration
                        }));
                    }
                    else
                        timer = setTimeout(onInterval, 1000 - ((now - start) % 1000));

                }

                function onUserActivity() {
                    idleTimeoutDate = idleTimeoutThreshold - idleNoticeDuration + Date.now();
                }

                setSessionRenewDate();
                timer = setTimeout(onInterval, 1000);
                $(document).on('keydown mousedown scroll', _.throttle(onUserActivity, 5000));
            }
        });

        return SessionTimeoutController;
    }
);