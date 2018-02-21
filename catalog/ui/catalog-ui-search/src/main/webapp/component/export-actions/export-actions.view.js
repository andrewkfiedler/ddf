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
const Marionette = require('marionette');
const template = require('./export-actions.hbs');
const CustomElements = require('js/CustomElements');

module.exports = Marionette.LayoutView.extend({
    template: template,
    tagName: CustomElements.register('export-actions'),
    serializeData: function() {
        const exportActions = this.model.getExportActions();
        return exportActions.map(action => ({
            url: action.url,
            title: action.title.replace('Export as', '').replace('Export','')
        }));
    }
});