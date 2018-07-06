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
const DropdownBehaviorUtility = require('./dropdown.behavior.utility');

const Common = require('js/Common');
const tagName = CustomElements.register('behavior-dropdown');
Behaviors.addBehavior('dropdown', Marionette.Behavior.extend({
    events() {
        return this.options.dropdowns.reduce((eventMap, dropdown) => {
            eventMap[`click ${dropdown.selector}`] = this.generateHandleClick(dropdown);
            return eventMap;
        }, {}); 
    },
    // We can't do this on initialize because view.cid isn't set yet.  OnFirstRender is closest to what we want.
    onFirstRender() {
        this.listenForOutsideClick();
        this.listenForResize();
    },
    generateHandleClick(dropdown){
        return (e) => {
            if (e.currentTarget.disabled) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.triggerDropdownClick(dropdown);
            this.handleDropdownClick(dropdown);
        };
    },
    getPossibleDropdownElements(dropdown) {
        const possibleDropdownElements = this.view.$el.find(dropdown.selector);
        if (possibleDropdownElements.length > 1) {
            console.warn(`More than 1 possible dropdown element found for selector:\n ${dropdown.selector}
                \n Update your selector in ${this.view.el.tagName} be more specific, otherwise you'll run into strange behavior!
            `);
        }
        return possibleDropdownElements;
    },
    getDropdownElement(dropdown) {
        return this.getPossibleDropdownElements(dropdown).first();
    },
    triggerDropdownClick(dropdown) {
        this.getDropdownElement(dropdown).trigger(`dropdownClick`);
    },
    handleDropdownClick(dropdown) {
        this.initializeDropdown(dropdown);
        dropdown._instance.$el.toggleClass('is-open');
        this.focusOnDropdown(dropdown);
    },
    isOpen(dropdown) {
        return dropdown._instance && dropdown._instance.$el.hasClass('is-open');
    },
    focusOnDropdown(dropdown) {
        if (this.isOpen(dropdown)) {
            dropdown._instance.$el.focus();
            if (dropdown._instance.focus) {
                dropdown._instance.focus();
            }
        }
    },
    createDropdownRegion(dropdown) {
        const $wrapper = $(`<${tagName}/>`);
        $('body').append($wrapper);
        dropdown._region = new Marionette.Region({
            el: $wrapper[0]
        });
    },
    showDropdown(dropdown) {
        dropdown._instance = new dropdown.view(dropdown.viewOptions);
        dropdown._instance.$el.attr('data-behavior-dropdown', true);
        dropdown._instance.$el.attr('tabindex', 0);
        dropdown._region.show(dropdown._instance, {replaceElement: true});
    },
    initializeDropdown(dropdown){
        if (!dropdown._instance) {
            this.createDropdownRegion(dropdown);
            this.showDropdown(dropdown);
            this.listenForClose(dropdown);
            this.listenForKeydown(dropdown);
        }
        this.updatePosition(dropdown);
        this.updateWidth(dropdown);
    },
    updateWidth(dropdown){
        var clientRect = this.getDropdownElement(dropdown)[0].getBoundingClientRect();
        dropdown._instance.$el.css('min-width', Math.min(clientRect.width, window.innerWidth - 20));
    },
    updatePosition (dropdown) {
        DropdownBehaviorUtility.updatePosition(
            dropdown._instance.$el,
            this.getDropdownElement(dropdown)[0]
        );
    },
    generateHandleKeydown(dropdown) {
        return (event) => {
            var code = event.keyCode;
            if (event.charCode && code == 0)
                code = event.charCode;
            switch (code) {
                case 27:
                    // Escape
                    event.preventDefault();
                    event.stopPropagation();
                    this.close(dropdown);
                    this.refocusOnDropdownElement(dropdown);
                    break;
            }
        }
    },
    generateHandleCloseDropdown(dropdown) {
        return (e) => {
            // stop from closing dropdowns higher in the dom
            e.stopPropagation();
            // close
            this.close(dropdown);
            this.refocusOnDropdownElement(dropdown);
        }
    },
    listenForKeydown(dropdown) {
        dropdown._instance.$el
            .on('keydown.' + CustomElements.getNamespace(), this.generateHandleKeydown(dropdown));
    },
    listenForClose(dropdown){
        dropdown._instance.$el
            .on('closeDropdown.'+CustomElements.getNamespace(), this.generateHandleCloseDropdown(dropdown));
    },
    refocusOnDropdownElement(dropdown) {
        this.getDropdownElement(dropdown).focus();
    },
    listenForOutsideClick () {
        $('body').off(`click.${this.view.cid} dropdownClick.${this.view.cid}`)
            .on(`click.${this.view.cid} dropdownClick.${this.view.cid}`, function (event) {
            if (!DropdownBehaviorUtility.drawing(event)){
                this.options.dropdowns.filter((dropdown) => { 
                    return this.isOpen(dropdown);
                }).forEach((dropdown) => {
                    if (dropdown._instance) {
                        this.checkOutsideClick(dropdown, event.target);
                    }
                });
            }
        }.bind(this));
    },
    checkOutsideClick(dropdown, clickedElement) {
        if (this.view.$el.find(this.getDropdownElement(dropdown))[0] === clickedElement) {
            // must have been a dropdownClick event, ignore these if from original triggering element 
            return;
        }
        if (DropdownBehaviorUtility.withinDOM(clickedElement) && !DropdownBehaviorUtility.withinAnyDropdown(clickedElement)) {
            this.close(dropdown);
        }
        if (DropdownBehaviorUtility.withinParentDropdown(dropdown._instance.$el, clickedElement)){
            this.close(dropdown);
        }
    },
    close(dropdown) {
        dropdown._instance.$el.removeClass('is-open');
    },
    stopListeningForOutsideClick () {
        $('body').off(`click.${this.view.cid} dropdownClick.${this.view.cid}`);
    },
    stopListeningForResize(){
        $(window).off(`resize.${this.view.cid}`);
    },
    listenForResize(){
        $(window).off(`resize.${this.view.cid}`)
            .on(`resize.${this.view.cid}`, _.throttle(function(){
            this.options.dropdowns.filter((dropdown) => { 
                return this.isOpen(dropdown);
            }).forEach((dropdown) => {
                if (dropdown._instance) {
                    this.updatePosition(dropdown);
                    this.updateWidth(dropdown);
                }
            })
        }.bind(this), 16));
    },
    destroyDropdown(dropdown) {
        if (dropdown._region) {
            dropdown._region.empty();
            dropdown._region.destroy();
            dropdown._region.$el.remove();
        }
    },  
    onDestroy(){
        this.stopListeningForOutsideClick();
        this.stopListeningForResize();
        //ensure that if a dropdown goes away, it's companions do too
        this.options.dropdowns.forEach((dropdown) => this.destroyDropdown(dropdown));
    }
}));