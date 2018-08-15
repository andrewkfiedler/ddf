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
import * as React from 'react';
import styled from 'styled-components';
import { Button, buttonType } from '../../../react-component/presentation/button'

const Root = styled.div`
    height: 100%;
`

const ButtonGuide =  (props) => {
    return (
        <Root {...props}>
            <div className="section">
                <div className="is-header">
                    Examples
                </div>
                <div className="examples is-list has-list-highlighting">
                    <div className="example">
                        <div className="title">
                            Neutral Button
                        </div>
                        <div className="instance">
                            <Button 
                                icon="fa fa-question"
                                text="Neutral Action"
                                type={buttonType.neutral}

                            />
                        </div>
                        <div className="editor" data-html></div>
                    </div>
                </div>
            </div>
        </Root>
    )
}

export default ButtonGuide