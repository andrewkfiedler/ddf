/**
 * Created by andrewfiedler on 2/8/16.
 */
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
    'backbone'
], function (Backbone) {

    var Action = Backbone.Model.extend({
        defaults: {
            description: "Provides a URL to the metacard",
            id: "catalog.data.metacard.viewExport Metacard XML",
            title: "Export Metacard XML",
            url: "https://localhost:8993/services/catalog/sources/ddf.distribution/d06aa8b0c494422880b7d68dddde513c"
        }
    });

    return Action;
});