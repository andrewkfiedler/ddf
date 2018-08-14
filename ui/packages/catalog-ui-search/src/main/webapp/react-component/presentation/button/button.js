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
import { readableColor, darken, lighten } from 'polished';

function determineBackgroundFromProps(props) {
    switch(props.type) {
        case 'positive':
            return props.theme.positiveColor;
        break;
        case 'negative':
            return props.theme.negativeColor;
        break;
        case 'primary':
            return props.theme.primaryColor;
        break;
        case 'neutral':
            return `rgba(0,0,0,0)`;
        break;
    }
}

function determineColorFromPropsDefault(props) {
    switch(props.type) {
        case 'neutral':
            return `inherit`;
        break;
        default:
            return readableColor(determineBackgroundFromProps(props)); 
        break;
    }
}

// most of our premade themes will want white text on buttons, if not we can change this later
function determineColorFromPropsPremade(props) {
    switch(props.type) {
        case 'neutral':
            return `inherit`;
        break;
        default:
            return 'white'; 
        break;
    }
}

function determineColorFromProps(props) {
    switch(props.theme.theme) {
        case 'dark':
            return determineColorFromPropsPremade(props);
        break;
        case 'light':
            return determineColorFromPropsPremade(props);
        break;
        case 'sea':
            return determineColorFromPropsPremade(props);
        break;
        default:
            return determineColorFromPropsDefault(props);
        break;
    }
}

const Root = styled.button`
    display: inline-block;
    border: none;
    padding: ${props => props.inText ? `0px ${props.theme.minimumSpacing}` : `0px`};
    border-radius: ${props => props.theme.borderRadius};
    font-size: ${props => props.inText ? 'inherit' : props.theme.largeFontSize};
    line-height: ${props => props.inText ? 'inherit' : props.theme.minimumButtonSize};
    height: ${props => props.inText ? 'auto' : props.theme.minimumButtonSize};
    text-align: center;

    background: ${props => determineBackgroundFromProps(props)};
    color: ${props => determineColorFromProps(props)};

    &:hover:not([disabled]) {
        background: ${props => darken(0.025, determineBackgroundFromProps(props))};
        box-shadow: 0px 0px 2px ${props => darken(0.025, determineBackgroundFromProps(props))};
    }

    &:focus:not([disabled]) {
        background: ${props => darken(0.05, determineBackgroundFromProps(props))};
        box-shadow: 0px 0px 2px ${props => darken(0.05, determineBackgroundFromProps(props))};
    }

    &:disabled {
        background: repeating-linear-gradient(
                45deg,
                ${props => lighten(0.1, determineBackgroundFromProps(props))},
                ${props => lighten(0.1, determineBackgroundFromProps(props))} 10px,
                ${props => darken(0.1, determineBackgroundFromProps(props))} 10px,
                ${props => darken(0.1, determineBackgroundFromProps(props))} 20px
        );
        cursor: not-allowed;
    }
`

const Icon = styled.span`
    margin-right: ${props => props.theme.minimumSpacing};
`

const Text = styled.span`

`


const Button =  (props) => {
    return (
        <Root {...props}>
            {props.icon ? 
                <Icon className={props.icon}></Icon> : ''
            }
            {props.text ? 
                <Text>{props.text}</Text> : ''
            }
        </Root>
    )
}

export default Button