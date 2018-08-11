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

const $ = require('jquery');
const wreqr = require('wreqr');
import LoadingCompanion from '../loading-companion'

// needed for golden-layout
const triggerResize = () => {
    wreqr.vent.trigger('resize');
    $(window).trigger('resize');
}

const isFetched = (props) => {
    if (props.isMenu) {
        return props.routeDefinition.menu.component !== undefined;
    } else {
        return props.routeDefinition.component !== undefined;
    }
}

class RouteContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routeDefinition: props.routeDefinition,
            isMenu: props.isMenu,
            isFetched: isFetched(props)
        }
    }
    getComponent() {
        if (this.state.isMenu) {
            return this.state.routeDefinition.menu.component;
        } else {
            return this.state.routeDefinition.component;
        }
    }
    fetchComponent() {
        if (this.state.isMenu) {
            return this.state.routeDefinition.menu.getComponent();
        } else {
            return this.state.routeDefinition.getComponent();
        }
    }
    componentDidMount() {
        if (this.state.isFetched !== false) {
            triggerResize();
        }
        this.deferred = this.fetchComponent();
        this.deferred.then(() => {
            this.setState({
                isFetched: true
            });
        })
    }
    componentWillUnmount() {
        this.deferred.reject();
    }
    render() {
        if (this.state.isFetched) {
            return <MarionetteRegionContainer view={this.getComponent()} />
        } else {
            return <LoadingCompanion />
        }
    }
}

export default RouteContainer