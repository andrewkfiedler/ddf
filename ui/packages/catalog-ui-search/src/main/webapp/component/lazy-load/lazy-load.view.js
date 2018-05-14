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
/* global require*/
const Marionette = require('marionette');
const template = require('./lazy-load.hbs');
const CustomElements = require('js/CustomElements');
const LoadingCompanionView = require('component/loading-companion/loading-companion.view');

const LazyLoadView = Marionette.LayoutView.extend({
    template: template,
    tagName: CustomElements.register('lazy-load'),
    regions: {
        component: '> div' 
    },
    componentToLoad() {
        throw new "You're using this wrong!";
    },
    initialize: function () {
        if (this.componentToLoad instanceof Function) {
          //  this.componentToLoad();
        }
    },
    onRender: function () {
        this.loadComponent().then(this.renderComponent.bind(this));
        if (this.component.currentView === undefined) {
            this.startLoading();
        }
    },
    loadComponent() {
        //overwrite me
    },
    renderComponent(component) {
        if (!this.isDestroyed) {
            component = component instanceof Function ? component : component.default;
            this.component.show(new component(this.options));
            LoadingCompanionView.endLoading(this);
        }
    },
    startLoading() {
        LoadingCompanionView.beginLoading(this);
    },
    endLoading() {
        LoadingCompanionView.endLoading(this);
    }
}, {
    wrapComponent: function(componentToLoad) {
        return this.extend({
            componentToLoad: componentToLoad
        });
    }
});

module.exports = LazyLoadView;