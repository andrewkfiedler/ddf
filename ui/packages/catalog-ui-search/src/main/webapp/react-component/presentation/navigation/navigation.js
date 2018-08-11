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
import { ChangeBackground } from '../../styles/changeBackground';
import { transparentize, readableColor } from 'polished';
import NavigationLeftComponent from '../navigation-left';
import NavigationRightComponent from '../../container/navigation-right-container';
import CancelDrawingContainer from '../../container/cancel-drawing-container'

const NavigationRight = styled.div`
    position: absolute;
    right: 0px;
    max-width: calc(4*${props => props.theme.minimumButtonSize} + 9rem);
    transition: width ${props => props.theme.coreTransitionTime} ease-in-out;
`

const NavigationMiddle = styled.div`
    width: ${props => {
        if (props.hasLogo) {
            if (props.hasUnavailable || props.hasUnsaved) {
                return `calc(100% - 6*${props.theme.minimumButtonSize} - 9rem - 1rem)`;
            } else {
                return `calc(100% - 6*${props.theme.minimumButtonSize} - 9rem)`;
            }
        } else if (props.hasUnavailable || props.hasUnsaved) {
            return `calc(100% - 5*${props.theme.minimumButtonSize} - 9rem - 1rem)`;
        } else {
            return `calc(100% - 5*${props.theme.minimumButtonSize} - 9rem)`;   
        }
    }};
    overflow-x: auto;
    overflow-y: hidden;
    text-overflow: ellipsis;
`

const CancelDrawingButton = styled.button`
    position: absolute;
    z-index: 101;
    height: 100%;
    line-height: ${props => props.theme.multiple(2, props.theme.minimumLineSize)};
    width: 100%;
    transform: translateY(-100%);
    transition: transform ${props => props.theme.coreTransitionTime} ease-in-out;
    transform: ${props => {
        if (props.isDrawing) {
            return 'translateY(0%)';
        } else {
            return 'translateY(-100%)';
        }
    }}
`

const Navigation = styled.div`
    ${CustomElement}
    ${props => ChangeBackground(props.theme.backgroundNavigation)}
    position: relative;
    vertical-align: top;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px solid ${props => transparentize(0.9, readableColor(props.theme.backgroundNavigation))};

    > div {
        display: inline-block;
        vertical-align: top;
        font-size: ${props => props.theme.largeFontSize};
        line-height: ${props => props.theme.multiple(2, props.theme.minimumLineSize)};
        height: ${props => props.theme.multiple(2, props.theme.minimumLineSize)};
    }
`

const NavigationComponent =  (props) => (
    <Navigation>
        <CancelDrawingContainer turnOffDrawing={props.turnOffDrawing}>
            <CancelDrawingButton className="is-negative" {...props}>
                <span className="fa fa-times"></span>
                <span>Cancel Drawing</span>
            </CancelDrawingButton>
        </CancelDrawingContainer>
        <NavigationLeftComponent showLogo={props.showLogo} hasUnavailable={props.hasUnavailable} hasUnsaved={props.hasUnsaved}>
        </NavigationLeftComponent>
        <NavigationMiddle {...props}>
            {props.middle}
        </NavigationMiddle>
        <NavigationRight>
            <NavigationRightComponent>
            </NavigationRightComponent>
        </NavigationRight>
    </Navigation>
)

export default NavigationComponent