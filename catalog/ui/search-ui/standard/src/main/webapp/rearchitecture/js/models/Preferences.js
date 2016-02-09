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
], function(Backbone) {

    var Preferences = Backbone.Model.extend({
        defaults: {
            resultCount: 250,
            showIngest: true,
            typeNameMapping: { },
            branding: "DDF",
            showWelcome: true,
            terrainProvider: {
                type: "CT",
                url: "/proxy/standard2"
            },
            gazetteer: true,
            helpUrl: "help.html",
            version: "2.9.0-SNAPSHOT",
            timeout: 15000,
            showTask: false,
            bingKey: "",
            imageryProviders: [
                {
                    type: "OSM",
                    fileExtension: "jpg",
                    url: "/proxy/standard0",
                    alpha: 1
                },
                {
                    type: "OSM",
                    fileExtension: "jpg",
                    url: "/proxy/standard1",
                    alpha: 0.5
                }
            ],
            projection: "EPSG:3857",
            externalAuthentication: false
        },
        url: '/services/store/config'
    });

    return new Preferences();
});