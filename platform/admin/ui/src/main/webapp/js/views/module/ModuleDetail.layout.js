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
    'backbone',
    'jquery',
    'marionette',
    'icanhaz',
    'js/wreqr',
    'text!moduleDetailLayout'
], function (Backbone, $, Marionette, ich, wreqr, moduleDetailLayout) {
    "use strict";

    ich.addTemplate('moduleDetailLayout', moduleDetailLayout);

    var exportUrl = '/jolokia/exec/org.codice.ddf.configuration.migration.ConfigurationMigrationManager:service=configuration-migration/export/etc!/exported';

    var ModuleDetailLayout = Marionette.Layout.extend({
        template: 'moduleDetailLayout',
        regions: {
            content: '.content',
            tabs: '.tab-container',
            tabContent: '.tab-content-container'
        },
        events: {
            'click .header > .btn': 'export'
        },
        export: function () {
            $.ajax({
                type: 'GET',
                url: exportUrl,
                dataType: 'JSON'
            }).then(function (response) {
                if (response.error) {
                    wreqr.vent.trigger('notify', {
                        type: 'error',
                        message: 'System failed to export to etc/exported.  Please see the logs for more details.'
                    });
                } else if (response.value.length !== 0) {
                    wreqr.vent.trigger('notify', {
                        type: 'warning',
                        message: 'System successfully exported to etc/exported, however there were some issues copying certain files.  Please see the logs for more details.'
                    });
                } else {
                    wreqr.vent.trigger('notify', {
                        type: 'success',
                        message: 'System successfully exported to etc/exported.'
                    });
                }
            });
        },
        selectFirstTab: function () {
            this.$('.tab-container a:first').tab('show');
        }
    });

    return ModuleDetailLayout;

});
