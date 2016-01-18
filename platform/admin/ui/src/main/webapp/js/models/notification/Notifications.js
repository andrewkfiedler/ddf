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
/*global define*/
define([
    'underscore',
    'backbone',
    'js/wreqr',
    'js/models/notification/Notification.js'
], function (_, Backbone, wreqr, NotificationModel) {

    var NotificationsModel = Backbone.Collection.extend({
        model: NotificationModel,
        initialize: function () {
            this.listenTo(wreqr.vent, 'notify', this.notify);
        },
        notify: function (args) {
            switch (args.type) {
                case 'error':
                    this.add(new NotificationModel.ErrorNotification(args));
                    break;
                case 'info':
                    this.add(new NotificationModel.InfoNotification(args));
                    break;
                case 'success':
                    this.add(new NotificationModel.SuccessNotification(args));
                    break;
                case 'warning':
                    this.add(new NotificationModel.WarningNotification(args));
                    break;
            }
        }
    });

    return NotificationsModel;
});
