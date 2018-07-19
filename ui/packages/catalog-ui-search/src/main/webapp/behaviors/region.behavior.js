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
/*global require*/
const Behaviors = require('./Behaviors');
const Marionette = require('marionette');
const _ = require('lodash');
const $ = require('jquery');
const CustomElements = require('js/CustomElements');
const Common = require('js/Common');
import { render } from 'react-dom';

const tagName = CustomElements.register('behavior-region');
Behaviors.addBehavior('region', Marionette.Behavior.extend({
    isInitialized(region) {
        return region._region !== undefined;
    },
    initialize() {  
        this.view.attachElContent = (html) => {
            render(html, this.view.el);
            return this.view;
        };
    },
    // onBeforeRender() {
    //     this.options.regions
    //         .filter((region) => this.isInitialized(region))
    //         .forEach((region) => {
    //             if (region._region.$el.find(document.activeElement).length > 0) {
    //                 region._focus = document.activeElement;
    //             }
    //             region._$el = region._region.$el.detach();
    //     });
    // },
    onFirstRender() {
        this.options.regions.forEach((region) => {
            const id = Common.generateUUID();
            region._region = new Marionette.Region({
                el: this.view.$el.find(region.selector)
            });
            region._region.show(new region.view(region.viewOptions))
        });
    },
    // onRender() {
    //     this.options.regions
    //     .filter((region) => this.isInitialized(region))
    //     .forEach((region) => {
    //         this.view.$el.find(region.selector).replaceWith(region._$el);
    //         if (region._focus) {
    //             $(region._focus).focus();
    //             delete region._focus;
    //         }
    //     });
    // },
    destroyRegion(region) {
        if (region._region) {
            region._region.empty();
            region._region.destroy();
            region._region.$el.remove();
            console.log('destroyed');
        }
    },  
    onDestroy(){
        this.options.regions.forEach((region) => this.destroyRegion(region));
    }
}));

module.exports = {
}