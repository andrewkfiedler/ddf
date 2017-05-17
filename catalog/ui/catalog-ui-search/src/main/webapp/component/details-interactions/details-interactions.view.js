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
    './details-interactions.hbs',
    'js/CustomElements',
    'decorator/menu-navigation.decorator',
    'decorator/Decorators',
    'component/dropdown/dropdown',
    'component/dropdown/add-attribute/dropdown.add-attribute.view',
    'component/dropdown/remove-attribute/dropdown.remove-attribute.view'
], function (Marionette, _, template, CustomElements, MenuNavigationDecorator, Decorators, DropdownModel, AddAttributeView, RemoveAttributeView) {

    return Marionette.LayoutView.extend(Decorators.decorate({
        template: template,
        tagName: CustomElements.register('details-interactions'),
        regions: {
            detailsAdd: {
                replaceElement: true,
                selector: '.interaction-add'
            },
            detailsRemove: {
                replaceElement: true,
                selector: '.interaction-remove'
            }
        },
        modelEvents: {
        },
        events: {
            'click .interaction-add': 'handleAdd',
            'click .interaction-remove': 'handleRemove'
           // 'click': 'handleClick'
        },
        initialize: function(){
            this.handleTypes();
        },
        handleTypes: function(){
            var types = {};
            this.options.selectionInterface.getSelectedResults().forEach(function(result){
                var tags = result.get('metacard').get('properties').get('metacard-tags');
                if (result.isWorkspace()){
                    types.workspace = true;
                } else if (result.isResource()){
                    types.resource = true;
                } else if (result.isRevision()){
                    types.revision = true;
                } else if (result.isDeleted()) {
                    types.deleted = true;
                }
                if (result.isRemote()){
                    types.remote = true;
                }
            });
            this.$el.toggleClass('is-mixed', Object.keys(types).length > 1);
            this.$el.toggleClass('is-workspace', types.workspace !== undefined);
            this.$el.toggleClass('is-resource', types.resource !== undefined);
            this.$el.toggleClass('is-revision', types.revision !== undefined);
            this.$el.toggleClass('is-deleted', types.deleted !== undefined);
            this.$el.toggleClass('is-remote', types.remote !== undefined);
        },
        generateDetailsAdd: function(){
            this.detailsAdd.show(new AddAttributeView({
                model: new DropdownModel(),
                selectionInterface: this.options.selectionInterface
            }), {
                replaceElement: true
            });
            this.listenTo(this.detailsAdd.currentView.model, 'change:value', this.handleAddAttribute);
        },
        generateDetailsRemove: function(){
            this.detailsRemove.show(new RemoveAttributeView({
                model: new DropdownModel(),
                selectionInterface: this.options.selectionInterface
            }), {
                replaceElement: true
            });
            this.listenTo(this.detailsRemove.currentView.model, 'change:value', this.handleRemoveAttribute);
        },
        onRender: function(){
            this.generateDetailsAdd();
            this.generateDetailsRemove();
        },
        handleRemoveAttribute: function(){
            this.model.set('attributesToRemove', this.detailsRemove.currentView.model.get('value'));
        },
        handleAddAttribute: function(){
            this.model.set('attributesToAdd', this.detailsAdd.currentView.model.get('value'));
        },
        handleClick: function(){
            this.$el.trigger('closeDropdown.'+CustomElements.getNamespace());
        }
    }, MenuNavigationDecorator));
});
