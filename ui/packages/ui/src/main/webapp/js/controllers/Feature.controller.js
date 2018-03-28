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
        'underscore',
        'components/features/features.view',
        'js/views/EmptyView',
        'js/models/features/feature'
    ], function(Marionette, _, FeaturesView, EmptyView, FeatureModel){
        "use strict";

        var FeatureController = Marionette.Controller.extend({

            initialize: function(options){
                this.region = options.region;
            },

            showAll: function(){
                if (this.region.currentView !== undefined) {
                    this.region.currentView.collection.fetch();
                    return;
                }
                var view = this;
                var features = new FeatureModel.Collection({
                });
                features.fetch({
                    success: function(collection) {
                        var featureView = view.getFeatureView({
                            collection: collection,
                            showWarnings: true
                        });
                        view.region.show(featureView);
                        view.listenTo(collection,"selected", view.onFeatureAction);
                    }
                });
            },

            getFeatureView: function(options) {
                if (options.collection && options.collection.length) {
                    return new FeaturesView(options);
                }
                return new EmptyView.view({message: 'No features are available for the "' + this.appName + '" application.'});
            },

            onFeatureAction: function (model){
                var self = this;
                var status = model.get("status");
                var featureModel = new FeatureModel.Model({
                    name: model.get("name")
                });
                //TODO: add loading div...
                if(status === "Uninstalled") {
                    var install = featureModel.install();
                    if(install){
                        install.done(function() {
                           self.showAll();
                        }).fail(function() {
                            if(console) {
                                console.log("install failed for feature: " + featureModel.name + " app: " + self.appName);
                            }
                        });
                    }
                }else{
                    var uninstall = featureModel.uninstall();
                    if(uninstall){
                        uninstall.done(function() {
                            self.showAll();
                        }).fail(function() {
                            if(console) {
                                console.log("uninstall failed for feature: " + featureModel.name + " app: " + self.appName);
                            }
                        });
                    }
                }
            }


        });

        return FeatureController;

    }
);