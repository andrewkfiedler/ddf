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
    './workspace-item.hbs',
    'js/CustomElements',
    'component/dropdown/dropdown',
    'component/dropdown/workspace-interactions/dropdown.workspace-interactions.view',
    'component/workspace-details/workspace-details.view',
    'component/save/workspace/workspace-save.view',
    'behaviors/button.behavior',
    'behaviors/region.behavior'
], function (wreqr, Marionette, _, $, template, CustomElements, DropdownModel, 
    WorkspaceInteractionsDropdownView, WorkspaceDetailsView, SaveView) {

    return Marionette.LayoutView.extend({
        template: template,
        tagName: CustomElements.register('workspace-item'),
        regions: {
            workspaceDetails: '.choice-details',
            workspaceSave: '.choice-save',
            workspaceActions: '.choice-actions'
        },
        behaviors() {
            return {
                button: {},
                region: {
                    regions: [
                        {
                            selector: '.choice-details',
                            view: WorkspaceDetailsView,
                            viewOptions: {
                                model: this.options.model
                            }
                        }
                    ]
                }
            };   
        },
        events: {
            'click': 'handleChoice',
            'mouseenter': 'preload'
        },
        preload: function() {
            wreqr.vent.trigger('router:preload', {
                fragment: 'workspaces/' + this.model.id
            });
        },
        initialize: function(){
            this.listenTo(this.model, 'change:saved', this.handleSaved);
        },
        onBeforeShow: function(){
            this.workspaceSave.show(new SaveView({
                model: this.model
            }));
            this.workspaceActions.show(new WorkspaceInteractionsDropdownView({
                model: new DropdownModel(),
                modelForComponent: this.model,
                dropdownCompanionBehaviors: {
                    navigation: {}
                }
            }));
            this.handleSaved();
        },
        handleChoice: function(event){
            var workspaceId = $(event.currentTarget).attr('data-workspaceId');
            wreqr.vent.trigger('router:navigate', {
                fragment: 'workspaces/'+this.model.id,
                options: {
                    trigger: true
                }
            });
        },
        handleSaved: function(){
            this.$el.toggleClass('is-saved', this.model.isSaved());
        },
        activateGridDisplay: function(){
            this.displayType = 'Grid';
            this.$el.addClass('as-grid').removeClass('as-list');
        },
        activateListDisplay: function(){
            this.displayType = 'List';
            this.$el.addClass('as-list').removeClass('as-grid');
        },
        displayType: undefined
    });
});
