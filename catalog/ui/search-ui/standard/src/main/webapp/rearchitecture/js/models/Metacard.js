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
    'backbone',
    'rearchitecture/js/models/Actions'
], function (Backbone, Actions) {

    var Metacard = Backbone.Model.extend({
        defaults: {
            metacardID: undefined,
            actions: [],
            geometry: null,
            created: "2016-02-09T00:20:00.143+0000",
            effective: "2016-02-09T00:20:00.143+0000",
            id: "d06aa8b0c494422880b7d68dddde513c",
            metacardType: "content",
            metadata: '<?xml version="1.0" encoding="UTF-8"?>',
            metadataContentType: "image/png",
            modified: "2016-02-09T00:20:00.143+0000",
            pointOfContact: "Guest@Guest@0:0:0:0:0:0:0:1",
            resourceDownloadUrl: "https://localhost:8993/services/catalog/sources/ddf.distribution/d06aa8b0c494422880b7d68dddde513c?transform=resource",
            resourceSize: "157448",
            resourceUri: "content:cbb084ec58c248a38e8a1b1500b9c6d4",
            sourceId: "ddf.distribution",
            thumbnail: "as;ldfkjsdf",
            title: "sizetouse.png",
            type: "Feature"
        },
        initialize: function(metacard){
            this.set('actions', new Actions(metacard.actions));
        }
    });

    return Metacard;
});