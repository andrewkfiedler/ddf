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
    'wreqr',
    'marionette',
    'underscore',
    'jquery',
    './workspace-details.hbs',
    'js/CustomElements',
    'moment',
    'component/singletons/user-instance'
], function (wreqr, Marionette, _, $, template, CustomElements, moment, user) {

    return Marionette.ItemView.extend({
        template: template,
        tagName: CustomElements.register('workspace-details'),
        initialize: function(options){
            this.listenTo(this.model, 'all', _.throttle(function(){
                if (!this.isDestroyed){
                    this.render();
                }
            }.bind(this), 200));
            this.listenTo(user.get('user').get('preferences'), 'change:homeDisplay', this.handleDisplayPref);
        },
        onRender: function(){
            this.handleDisplayPref();
            this.handleSaved();
        },
        handleSaved: function(){
            this.$el.toggleClass('is-saved', this.model.isSaved());
        },
        handleDisplayPref: function(){
            this.$el.toggleClass('as-list', user.get('user').get('preferences').get('homeDisplay') === 'List');
        },
        serializeData: function() {
            var workspacesJSON = this.model.toJSON();
            workspacesJSON.niceDate = moment(workspacesJSON.modified).fromNow();
            return workspacesJSON;
        },
    });
});
