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
/*global define, window*/

define([
        'marionette',
        'backbone',
        'openlayers',
        'underscore',
        'properties',
        'wreqr',
        'maptype',
        './notification.view',
        '@turf/turf'
    ],
    function (Marionette, Backbone, ol, _, properties, wreqr, maptype, NotificationView,
              Turf) {
        "use strict";

        function translateFromOpenlayersCoordinates(coords) {
            var coordinates = [];
            _.each(coords, function (point) {
                coordinates.push(ol.proj.transform([point[0], point[1]], properties.projection, 'EPSG:4326'));
            });
            return coordinates;
        }

        function translateToOpenlayersCoordinates(coords) {
            var coordinates = [];
            _.each(coords, function (item) {
                if (item[0].constructor === Array){
                    coordinates.push(translateToOpenlayersCoordinates(item));
                } else {
                    coordinates.push(ol.proj.transform([item[0], item[1]], 'EPSG:4326', properties.projection));
                }
            });
            return coordinates;
        }

        var Draw = {};

        Draw.LineView = Marionette.View.extend({
            initialize: function (options) {
                this.map = options.map;
                this.listenTo(this.model, 'change:line change:lineWidth', this.updatePrimitive);
                this.updatePrimitive(this.model);
            },
            setModelFromGeometry: function (geometry) {
                this.model.set({
                    line: translateFromOpenlayersCoordinates(geometry.getCoordinates())
                });
            },

            modelToPolygon: function (model) {
                var polygon = model.get('line');
                var setArr = _.uniq(polygon);
                if (setArr.length < 2) {
                    return;
                }

                var rectangle = new ol.geom.LineString(translateToOpenlayersCoordinates(setArr));
                return rectangle;
            },

            updatePrimitive: function (model) {
                var polygon = this.modelToPolygon(model);
                // make sure the current model has width and height before drawing
                if (polygon && !_.isUndefined(polygon)) {
                    this.drawBorderedPolygon(polygon);
                }
            },

            updateGeometry: function (model) {
                var rectangle = this.modelToPolygon(model);
                if (rectangle) {
                    this.drawBorderedPolygon(rectangle);
                }
            },

            drawBorderedPolygon: function (rectangle) {

                if (!rectangle) {
                    // handles case where model changes to empty vars and we don't want to draw anymore
                    return;
                }
                var lineWidth = this.model.get('lineWidth') || 1;

                var turfLine = Turf.lineString(translateFromOpenlayersCoordinates(rectangle.getCoordinates()));
                var bufferedLine = Turf.buffer(turfLine, lineWidth, 'meters');
                var geometryRepresentation = new ol.geom.MultiLineString(translateToOpenlayersCoordinates(bufferedLine.geometry.coordinates));

                if (this.vectorLayer) {
                    this.map.removeLayer(this.vectorLayer);
                }

                this.billboard = new ol.Feature({
                    geometry: geometryRepresentation
                });

                var color = this.model.get('color');

                var iconStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({color: color ? color : '#914500', width: 3})
                });
                this.billboard.setStyle(iconStyle);

                var vectorSource = new ol.source.Vector({
                    features: [this.billboard]
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });

                this.vectorLayer = vectorLayer;
                this.map.addLayer(vectorLayer);
            },

            handleRegionStop: function (sketchFeature) {
                this.setModelFromGeometry(sketchFeature.feature.getGeometry());
                this.drawBorderedPolygon(sketchFeature.feature.getGeometry());
                this.listenTo(this.model, 'change:line', this.updateGeometry);
                this.listenTo(this.model, 'change:lineWidth', this.updateGeometry);

                this.model.trigger("EndExtent", this.model);
                wreqr.vent.trigger('search:linedisplay', this.model);
            },
            start: function () {
                var that = this;

                this.primitive = new ol.interaction.Draw({
                    type: 'LineString',
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 255, 0]
                        })
                    })
                });

                this.map.addInteraction(this.primitive);
                this.primitive.on('drawend', function (sketchFeature) {
                    window.cancelAnimationFrame(that.accurateLineId);
                    that.handleRegionStop(sketchFeature);
                    that.map.removeInteraction(that.primitive);
                });
                this.primitive.on('drawstart', function (sketchFeature) {
                    that.showAccurateLine(sketchFeature);
                });
            },
            accurateLineId: undefined,
            showAccurateLine: function(sketchFeature){
                this.accurateLineId = window.requestAnimationFrame(function(){
                    this.drawBorderedPolygon(sketchFeature.feature.getGeometry());
                    this.showAccurateLine(sketchFeature);
                }.bind(this));
            },

            stop: function () {
                this.stopListening();
            },


            destroyPrimitive: function () {
                window.cancelAnimationFrame(this.accurateLineId);
                if (this.primitive) {
                    this.map.removeInteraction(this.primitive);
                }
                if (this.vectorLayer) {
                    this.map.removeLayer(this.vectorLayer);
                }
            },
            destroy: function(){
                this.destroyPrimitive();
                this.remove();
            }

        });

        Draw.Controller = Marionette.Controller.extend({
            enabled: true,
            initialize: function (options) {
                this.map = options.map;
                this.notificationEl = options.notificationEl;

                this.listenTo(wreqr.vent, 'search:linedisplay', function (model) {
                    this.showBox(model);
                });
                this.listenTo(wreqr.vent, 'search:drawline', function (model) {
                    this.draw(model);
                });
                this.listenTo(wreqr.vent, 'search:drawstop', function(model) {
                    this.stop(model);
                });
                this.listenTo(wreqr.vent, 'search:drawend', function(model) {
                    this.destroy(model);
                });
                this.listenTo(wreqr.vent, 'search:destroyAllDraw', function(model) {
                    this.destroyAll(model);
                });
            },
            views: [],
            isVisible: function () {
                return this.map.getTarget().offsetParent !== null;
            },
            destroyAll: function () {
                for (var i = this.views.length - 1; i >= 0; i -= 1) {
                    this.destroyView(this.views[i]);
                }
            },
            getViewForModel: function(model) {
                return this.views.filter(function(view) {
                    return view.model === model && view.map === this.map;
                }.bind(this))[0];
            },
            removeViewForModel: function (model) {
                var view = this.getViewForModel(model);
                if (view) {
                    this.views.splice(this.views.indexOf(view), 1);
                }
            },
            removeView: function (view) {
                this.views.splice(this.views.indexOf(view), 1);
            },
            addView: function (view) {
                this.views.push(view);
            },
            showBox: function (model) {
                if (this.enabled) {

                    var existingView = this.getViewForModel(model);
                    if (existingView) {
                        existingView.destroyPrimitive();
                        existingView.updatePrimitive(model);
                    } else {
                        var view = new Draw.LineView(
                            {
                                map: this.map,
                                model: model
                            });
                        view.updatePrimitive(model);
                        this.addView(view);
                    }

                    return model;
                }
            },
            draw: function (model) {
                if (this.enabled) {
                    var view = new Draw.LineView(
                        {
                            map: this.map,
                            model: model
                        });

                    var existingView = this.getViewForModel(model);
                    if (existingView) {
                        existingView.stop();
                        existingView.destroyPrimitive();
                        this.removeView(existingView);
                    }
                    view.start();
                    this.addView(view);
                    this.notificationView = new NotificationView({
                        el: this.notificationEl
                    }).render();
                    model.trigger('BeginExtent');
                    this.listenToOnce(model, 'EndExtent', function () {
                        this.notificationView.destroy();
                    });

                    return model;
                }
            },
            stop: function (model) {
                var view = this.getViewForModel(model);
                if (view) {
                    view.stop();
                }
                if (this.notificationView) {
                    this.notificationView.destroy();
                }
            },
            destroyView: function (view) {
                view.stop();
                view.destroyPrimitive();
                this.removeView(view);
            },
            destroy: function (model) {
                this.stop(model);
                var view = this.getViewForModel(model);
                if (view) {
                    view.stop();
                    view.destroyPrimitive();
                    this.removeView(view);
                    if (this.notificationView) {
                        this.notificationView.destroy();
                    }
                }
            }
        });

        return Draw;
    });
