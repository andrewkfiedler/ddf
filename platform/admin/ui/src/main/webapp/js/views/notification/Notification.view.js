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
/*global define*/
define([
    'marionette',
    'icanhaz',
    'jquery',
    'text!notificationView'
], function (Marionette, ich, $, notificationView) {

    ich.addTemplate('notificationView', notificationView);

    var NotificationView = Marionette.ItemView.extend({
        template: 'notificationView',
        tagName: 'ddf-notification',
        className: function () {
            return 'is-' + this.model.get('type');
        },
        events: {
            'click': 'dismiss'
        },
        dismiss: function () {
            this.dismiss = $.noop;
            var self = this;
            $(this.el).animate({
                top: '-10%',
                opacity: 0
            }, 1000, function () {
                self.model.destroy();
            });
        },
        onRender: function () {
            var self = this;
            var model = self.model;
            var get = model.get.bind(model);
            $(self.el).css('top', '110%');
            $(self.el).animate({
                top: '10%',
                opacity: 1
            }, 1000, function () {
                if (get('autoDismiss')){
                    self.dismiss();
                }
            });
        }
    });
    return NotificationView;
});