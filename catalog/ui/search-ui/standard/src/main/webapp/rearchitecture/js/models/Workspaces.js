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
/*global define, setTimeout*/
define([
    'backbone',
    'underscore',
    'rearchitecture/js/models/Workspace'
], function (Backbone, _, Source) {

    var refetch = function () {
        var collection = this;
        setTimeout(function () {
            collection.fetch();
        }, pollingInterval);
    };

    var pollingInterval = 10000; // 10 seconds

    var Sources = Backbone.Collection.extend({
        model: Source,
        url: '/services/catalog/sources',
        initialize: function () {
            refetch = refetch.bind(this);
            var collection = this;
            collection.on({
                'sync': refetch,
                'error': refetch
            });
            collection.fetch();
        }
    });

    return new Sources();
});