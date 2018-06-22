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
/*global require,define,setTimeout*/
define([
    'marionette',
    'jquery',
    'js/application',
    'text!./module.hbs',
    'components/tab-item/tab-item.collection.view',
    'components/tab-content/tab-content.collection.view',
    'iframeresizer'
], function (Marionette, $, Application, template, TabItemCollectionView, TabContentCollectionView) {

    var ModuleView = Marionette.Layout.extend({
        template: template,
        className: 'relative full-height',
        regions: {
            tabs: '> div:first-of-type',
            tabContent: '> div:last-of-type'
        },
        onRender: function () {
            this.tabs.show(new TabItemCollectionView({
                collection: this.model.get('value')
            }));
            this.tabContent.show(new TabContentCollectionView({
                collection: this.model.get('value')
            }));
        }
    });

    return ModuleView;
});