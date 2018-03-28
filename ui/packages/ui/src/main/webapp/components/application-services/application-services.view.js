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
/*global define, window*/
define([
    'icanhaz',
    'underscore',
    'marionette',
    'js/models/Service',
    'js/views/configuration/ConfigurationEdit.view',
    'js/views/EmptyView',
    'js/wreqr.js',
    'js/views/Utils.js',
    'text!./application-services.hbs',
    'components/service-item/service-item.collection.view',
    'js/CustomElements'
    ],function (ich, _, Marionette, Service, ConfigurationEdit, EmptyView, wreqr, Utils, servicePage, ServiceItemCollectionView, CustomElements) {

    ich.addTemplate('servicePage', servicePage);

    return Marionette.Layout.extend({
        tagName: CustomElements.register('application-services'),
        template: 'servicePage',
        regions: {
            collectionRegion: '.services'
        },
        initialize: function(options) {
            _.bindAll.apply(_, [this].concat(_.functions(this)));
            this.poller = options.poller;
            this.listenTo(this.model, 'services:refresh', this.stopRefreshSpin);
            if(this.poller){
                this.listenTo(wreqr.vent, 'poller:stop', this.stopPoller);
                this.listenTo(wreqr.vent, 'poller:start', this.startPoller);
                this.listenTo(this.model, 'sync', this.triggerSync);
            }
            this.refreshButton = Utils.refreshButton('.refreshButton', this.refreshServices, this);
            this.showWarnings = options.showWarnings;
            this.url = options.url;
        },
        onShow: function() {
            this.refreshButton.init();
        },
        onDestroy: function() {
            this.refreshButton.cleanUp();
        },
        triggerSync: function() {
            wreqr.vent.trigger('sync');
        },
        stopPoller: function() {
            this.poller.stop();
        },
        startPoller: function() {
            this.poller.start();
        },
        onRender: function() {
            this.model.get("value").comparator = function( model ) {
                return model.get('name');
            };

            var collection = this.model.get("value").sort();
            this.collectionRegion.show(new ServiceItemCollectionView({ collection: collection, showWarnings: this.showWarnings }));
        },
        refreshServices: function() {
            wreqr.vent.trigger('refreshConfigurations');
        },
        stopRefreshSpin: function(source) {
            if (this.cid === source.view.cid) {
                this.refreshButton.done();
            }
        }
    });

});