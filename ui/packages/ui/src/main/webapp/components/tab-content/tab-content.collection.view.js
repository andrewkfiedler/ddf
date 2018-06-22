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
/* global define */
define([
    'marionette',
    './tab-content.view',
    'js/wreqr.js',
    'js/CustomElements',
    'iframeresizer'
    ],function (Marionette, TabContentView, wreqr, CustomElements) {

    var PluginTabContentsView = Marionette.CollectionView.extend({
        className: 'tab-content',
        tagName: CustomElements.register('tab-content-collection'),
        itemView: TabContentView,
        itemViewOptions: function(){
            return {
                applicationModel: this.model
            };
        },
        onAfterItemAdded: function(itemView) {
            if (this.children.length === 1) {
                itemView.$el.addClass('active in');
            }
        }
    });

    return PluginTabContentsView;
});