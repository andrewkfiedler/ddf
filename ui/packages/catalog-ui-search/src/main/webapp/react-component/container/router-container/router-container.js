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
import MarionetteRegionContainer from '../../container/marionette-region-container';
const RouteView = require('component/route/route.view');

import Navigation from '../navigation-container';
import ThemeContainer from '../theme-container';

class RouterContainer extends React.Component {
    constructor() {
        super();
    }
    render() {
        const content = <MarionetteRegionContainer view={RouteView} viewOptions={{...this.props}}>
                        </MarionetteRegionContainer>
        const navigation = <Navigation {...this.props} />
        return (
            <ThemeContainer>
                <Router nav={navigation} content={content} {...this.props}></Router>
            </ThemeContainer>
        )
    }
}

export default RouterContainer