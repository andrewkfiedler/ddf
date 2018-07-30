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
import React from 'react';
import MarionetteRegionContainer from '../../container/marionette-region-container';
import Navigation from '../../presentation/navigation';

const Backbone = require('backbone');

var NavigationLeftView = require('component/navigation-left/navigation-left.view');
var RouteView = require('component/route/route.view');
var NavigationRightView = require('component/navigation-right/navigation-right.view');

var store = require('js/store');
var wreqr = require('wreqr');
var sources = require('component/singletons/sources-instance');
var properties = require('properties');

const hasLogo = () => {
    return properties.showLogo && properties.ui.vendorImage !== ""
}

const hasUnavailable = () => {
    return sources.some(function(source){
        return !source.get('available');
    });
}

const hasUnsaved = () => {
    return store.get('workspaces').some(function(workspace){
        return !workspace.isSaved();
    });
}

const isDrawing = () => {
    return store.get('content').get('drawing');
}

class NavigationContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            hasLogo: hasLogo(),
            hasUnavailable: hasUnavailable(),
            hasUnsaved: hasUnsaved(),
            isDrawing: isDrawing()
        }
    }
    componentDidMount() {
        this.backbone = new Backbone.Model({});
        this.backbone.listenTo(store.get('workspaces'), 'change:saved update add remove', this.handleSaved.bind(this));
        this.backbone.listenTo(sources, 'all', this.handleSources.bind(this));
        this.backbone.listenTo(store.get('content'), 'change:drawing', this.handleDrawing.bind(this));
    }
    handleSaved() {
        this.setState({
            hasUnsaved: hasUnsaved()
        })
    }
    handleSources() {
        this.setState({
            hasUnavailable: hasUnavailable()
        })
    }
    handleDrawing() {
        this.setState({
            isDrawing: isDrawing()
        })
    }
    componentWillUnmount() {
        this.backbone.stopListening();
    }
    handleCancelDrawing(e){
        e.stopPropagation();
        wreqr.vent.trigger('search:drawend', store.get('content').get('drawingModel'));
    }
    render(props) {
        const left = <MarionetteRegionContainer view={NavigationLeftView} viewOptions={{...this.props}} />
        const middle = <MarionetteRegionContainer view={RouteView} viewOptions={{isMenu: true, ...this.props}} />
        const right = <MarionetteRegionContainer view={NavigationRightView} viewOptions={{...this.props}} />
        return (
            <Navigation 
                isDrawing={this.state.isDrawing}
                hasUnavailable={this.state.hasUnavailable} 
                hasUnsaved={this.state.hasUnsaved} 
                hasLogo={this.state.hasLogo} 
                left={left} middle={middle} right={right} 
                {...this.props}>
            </Navigation>
        )
    }
}

export default NavigationContainer