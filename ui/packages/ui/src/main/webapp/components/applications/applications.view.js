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
/* jshint -W024*/
/** Main view page for add. **/
define([
    'require',
    'backbone',
    'marionette',
    'icanhaz',
    'underscore',
    'jquery',
    'components/application-item/application-item.collection.view',
    'js/wreqr.js',
    'text!./applications.hbs',
    'js/CustomElements',
    'js/models/ApplicationsLayout',
    'components/application/application.view'
], function(require, Backbone, Marionette, ich, _, $, AppCardCollectionView, wreqr, template, CustomElements, ApplicationsLayout, ApplicationView) {
    "use strict";

    var Model = {};

    // Main layout view for all the applications
    return Marionette.Layout.extend({
        template: template,
        tagName: CustomElements.register('applications'),
        className: 'full-height well',
        regions: {
            applications: '> .applications',
            application: '> .application'
        },
        initialize: function () {
            this.modelClass = ApplicationsLayout;
            if(this.modelClass) {
                Model.Collection = new this.modelClass.TreeNodeCollection();

                this.response = new this.modelClass.Response();
                this.model = Model.Collection;
                this.response.fetch().then(function(apps){
                    this.model.reset(apps);
                }.bind(this));
            }
            this.listenTo(wreqr.vent,'application:selected' , this.showApplication);
            this.listenTo(wreqr.vent, 'navigateTo:applicationHome', this.showApplications);
        },
        onRender: function () {
            this.applications.show(new AppCardCollectionView({collection: this.model}));
        },
        showApplications: function() {
            this.$el.removeClass('show-app');
        },
        showApplication: function(applicationModel) {
            this.$el.addClass('show-app');
            this.application.show(new ApplicationView({model: applicationModel}));
        }
    });

});
