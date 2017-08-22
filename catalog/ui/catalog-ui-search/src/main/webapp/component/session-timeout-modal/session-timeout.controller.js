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
        './lightbox/lightbox.view',
        './session-timeout.view'
    ], function ($, _, Marionette, wreqr, SessionTimeoutLightbox, SessionTimeoutModal) {
        'use strict';
        var SessionTimeoutController;

        var idleNoticeDuration = 60000;
        var idleTimeoutThreshold = 900000;  // Length of inactivity that will trigger user timeout
        // See STIG V-69243

        SessionTimeoutController = Marionette.Object.extend({
            initialize: function () {
                this.initTimer();

                wreqr.vent.on("sessionRenewed", _this.initTimer);
            },

            initTimer: function () {
                var timer = null;
                var sessionRenewDate = 0;
                var idleTimeoutDate = idleTimeoutThreshold - idleNoticeDuration + Date.now();
                var modalShown = false;

                wreqr.vent.on("continueClicked", function () {
                    modalShown = false;
                });

                function getAndSetSessionRenewDate() {
                    $.get("/services/internal/session/expiry", setSessionRenewDate);

                }

                function setSessionRenewDate(res) {
                    var msUntilTimeout = parseInt(res);
                    if (msUntilTimeout === 0) {
                        clearTimeout(timer);
                    }

                    var msUntilAutoRenew = Math.max(msUntilTimeout * 0.7, msUntilTimeout - 60000);
                    sessionRenewDate = Date.now() + msUntilAutoRenew;
                }

                function onInterval() {
                    var now = Date.now();

                    if (now >= sessionRenewDate) {
                        $.get("/services/internal/session/renew", setSessionRenewDate);
                    }

                    if (now >= idleTimeoutDate && !modalShown) {
                        $(document).off('keydown mousedown scroll');
                        var blockingLightbox = SessionTimeoutLightbox.generateNewLightbox();

                        blockingLightbox.model.updateTitle("Session Expiring");
                        blockingLightbox.model.open();
                        blockingLightbox.lightboxContent.show(new SessionTimeoutModal({
                            time: idleNoticeDuration
                        }));
                        modalShown = true;
                    }
                }

                // handles on scroll, avoid expensive processing
                function onUserActivity() {
                    idleTimeoutDate = idleTimeoutThreshold - idleNoticeDuration + Date.now();
                }

                getAndSetSessionRenewDate();
                timer = setTimeout(onInterval, 1000);
                $(document).on('keydown mousedown scroll', _.throttle(onUserActivity, 5000));
            }
        });

        return SessionTimeoutController;
    }
);