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
import Router from '../../presentation/router'
import {ThemeProvider} from 'styled-components'
const user = require('component/singletons/user-instance');
import MarionetteRegionContainer from '../../container/marionette-region-container';
const NavigationView = require('component/navigation/navigation.view');
const RouteView = require('component/route/route.view');

class RouterContainer extends React.Component {
    constructor() {
        super();
        this.state = user.get('user').get('preferences').get('theme').getTheme()
    }
    componentDidMount() {
        user.get('user').get('preferences').on('change:theme', this.updateTheme.bind(this));
    }
    updateTheme() {
        this.setState(user.get('user').get('preferences').get('theme').getTheme())
    }
    render() {
        const nav = <MarionetteRegionContainer view={NavigationView} viewOptions={{...this.props}}>
                    </MarionetteRegionContainer>
        const content = <MarionetteRegionContainer view={RouteView} viewOptions={{...this.props}}>
                        </MarionetteRegionContainer>
        return (
            <ThemeProvider theme={this.state}>
                <Router nav={nav} content={content} {...this.props}></Router>
            </ThemeProvider>
        )
    }
}

export default RouterContainer