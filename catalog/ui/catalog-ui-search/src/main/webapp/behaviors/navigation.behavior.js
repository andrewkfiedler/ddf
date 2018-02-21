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
var Behaviors = require('./Behaviors');
var Marionette = require('marionette');

var $ = require('jquery');

const expandComposedMenus = (menuItems) => {
    let expandedItems = [];
    let expanded = false;
    menuItems.forEach(element => {
        if ($(element).hasClass('composed-menu')) {
            expanded = true;
            expandedItems = expandedItems.concat($(element).children().toArray());
        } else {
            expandedItems.push(element);
        }
    });
    if (expanded === false) {
        return expandedItems;
    } else {
        return expandComposedMenus(expandedItems);
    }
};

const handleArrowKey = (componentView, up) => {
    let menuItems = componentView.handleTabIndexes();
    let currentActive = menuItems.filter(element => $(element).hasClass('is-active'))[0];
    var potentialNext = menuItems[menuItems.indexOf(currentActive) + (up === true ? -1 : 1)];
    if (potentialNext !== undefined) {
        $(currentActive).removeClass('is-active');
        $(potentialNext).addClass('is-active').focus();
    } else if (menuItems.indexOf(currentActive) === 0) {
        $(currentActive).removeClass('is-active');
        $(menuItems[menuItems.length -1]).addClass('is-active').focus();
    } else {
        $(currentActive).removeClass('is-active');
        $(menuItems[0]).addClass('is-active').focus();
    }
};

Behaviors.addBehavior('navigation', Marionette.Behavior.extend({
    events: {
        'focusin *': 'handleFocusIn',
        'keydown': 'handleSpecialKeys'
    },
    onRender: function() {
        this.view.$el.addClass('is-action-list');
    },
    getMenuItems: function() {
        return this.getAllPossibleMenuItems().filter(element => element.offsetParent !== null);
    },
    getAllPossibleMenuItems: function() {
        let menuItems = this.$el.find('> *').toArray();
        let fullMenuItems = expandComposedMenus(menuItems);
        return fullMenuItems;
    },
    focus: function(){
        let menuItems = this.handleTabIndexes();
        $(menuItems).removeClass('is-active');
        $(menuItems[0]).addClass('is-active').focus();
    },
    handleEnter: function() {
        let menuItems = this.getMenuItems();
        let $currentActive = $(menuItems.filter(element => $(element).hasClass('is-active'))[0]);
        if (this.focusedElement === undefined || this.focusedElement === $currentActive[0]) {
            $currentActive.click();
        }
    },
    handleUpArrow: function() {
        handleArrowKey(this, true);
    },
    handleDownArrow: function() {
        handleArrowKey(this, false);
    },
    handleFocusIn: function(e) {
        this.focusedElement = e.target;
    },
    handleTabIndexes: function(){
        let menuItems = this.getMenuItems();
        menuItems.forEach(element => {
            if (element.tabIndex === -1) {
                element.tabIndex = 0;
            }
        });
        return menuItems;
    },
    handleSpecialKeys: function(event){
        var code = event.keyCode;
        if (event.charCode && code == 0)
            code = event.charCode;
        switch(code) {
            case 38:
                // Key up.
                event.preventDefault();
                this.handleUpArrow();
                break;
            case 40:
                // Key down.
                event.preventDefault();
                this.handleDownArrow();
                break;
        }
    }
}));