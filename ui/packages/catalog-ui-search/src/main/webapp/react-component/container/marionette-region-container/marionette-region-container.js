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
import Marionette from 'backbone.marionette';
import styled from 'styled-components';
const intervalToCheck = 20;
import { CustomElement } from '../../styles/customElement';

const RegionContainer = styled.div`
    ${CustomElement}
`
class MarionetteRegionContainer extends React.Component {
    constructor(props) {
        super(props);
        this.regionRef = React.createRef();
    }
    showComponentInRegion() {
        if (this.props.view._isMarionetteView) {
            this.region.show(this.props.view);
        } else {
            this.region.show(new this.props.view(this.props.viewOptions));
        }
    }
    componentDidMount() {
        this.checkForMount = setInterval(() => {
            if (document.body.contains(this.regionRef.current)) {
                clearInterval(this.checkForMount);
                this.region = new Marionette.Region({
                    el: this.regionRef.current
                });
                this.showComponentInRegion();
            }
        }, intervalToCheck);
    }
    componentWillUnmount() {
        clearInterval(this.checkForMount);
        if (this.region) {
            this.region.empty();
            this.region.destroy();
            this.region.$el.remove();
        }
    }
    render() {
        return <RegionContainer innerRef={this.regionRef} {...this.props}/>
    }
}

export default MarionetteRegionContainer