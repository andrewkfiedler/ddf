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
            this.region.show(this.props.view, { replaceElement: this.props.replaceElement });
        } else {
            this.region.show(new this.props.view(this.props.viewOptions), { replaceElement: this.props.replaceElement });
        }
    }
    onceInDOM(callback) {
        clearInterval(this.checkForElement);
        this.checkForElement = setInterval(() => {
            if (document.body.contains(this.regionRef.current)) {
                clearInterval(this.checkForElement);
                callback();
            }
        })
    }
    handleViewChange() {
        this.resetRegion();
        this.onceInDOM(() => {
            this.showComponentInRegion();
        });
    }
    // we might need to update this to account for more scenarios later
    componentDidUpdate(prevProps) {
        if (this.props.view !== prevProps.view) {
            this.handleViewChange();
        }
    }
    componentDidMount() {
        this.onceInDOM(() => {
            this.region = new Marionette.Region({
                el: this.regionRef.current
            });
            this.showComponentInRegion();
        });
    }
    resetRegion() {
        if (this.region) {
            this.region.empty();
        }
    }
    componentWillUnmount() {
        clearInterval(this.checkForElement);
        if (this.region) {
            this.region.empty();
            this.region.destroy();
        }
    }
    render() {
        const { className, otherProps } = this.props;
        return <RegionContainer className={`marionette-region-container ${className}`} innerRef={this.regionRef} {...otherProps}/>
    }
}

export default MarionetteRegionContainer