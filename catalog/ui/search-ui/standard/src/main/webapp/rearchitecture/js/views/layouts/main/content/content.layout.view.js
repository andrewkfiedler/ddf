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
    'icanhaz',
    'jquery',
    'text!rearchitecture/templates/layouts/main/content/content.layout.handlebars',
    'rearchitecture/js/CustomElements'
], function (Marionette, ich, $, contentLayout, CustomElements) {

    ich.addTemplate('contentLayout', contentLayout);

    var ContentLayout = Marionette.LayoutView.extend({
        template: 'contentLayout',
        tagName: CustomElements.register('main-content-layout'),
        regions: {
            left: ".leftPane",
            middle: ".middlePane",
            right: ".rightPane"
        }
    });

    return ContentLayout;
});