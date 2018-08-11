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
import styled from 'styled-components';
import { CustomElement } from '../../styles/customElement';
const LoadingCompanionView = require('component/loading-companion/loading-companion.view');

const Root = styled.div`
    ${CustomElement}
`

class LoadingCompanionContainer extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    componentDidMount() {
        LoadingCompanionView.loadElement(this.ref.current);
    }
    componentWillUnmount() {
        LoadingCompanionView.stopLoadingElement(this.ref.current);
    }
    render() {
        return <Root innerRef={this.ref} />
    }
}

export default LoadingCompanionContainer