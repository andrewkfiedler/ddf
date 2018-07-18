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

const tagName = CustomElements.register('behavior-region');
Behaviors.addBehavior('region', Marionette.Behavior.extend({
    onBeforeRender() {
        console.log('before render');
    },
    onFirstRender() {
        this.options.regions.forEach((region) => {
            const id = Common.generateUUID();
            region._regionId = id;
            this.view.addRegions({
                [id]: region.selector
            });
            this.view[id].show(new region.view(region.viewOptions))
        });
    },
    destroyRegion(region) {
        
    },  
    onDestroy(){
        console.log('before render');
        this.options.regions.forEach((region) => this.destroyRegion(region));
    }
}));

module.exports = {
}