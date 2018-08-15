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
import styled from 'styled-components'
import { readableColor, darken, lighten } from 'polished';

export enum buttonType {
    neutral,
    positive,
    negative,
    primary
}

interface RootProps {
    inText?: boolean,
    buttonType: buttonType,
    theme?: any
}

function determineBackgroundFromProps(props: RootProps) {
    switch(props.buttonType) {
        case buttonType.positive:
            return props.theme.positiveColor;
        case buttonType.negative:
            return props.theme.negativeColor;
        case buttonType.positive:
            return props.theme.primaryColor;
        case buttonType.neutral:
            return `rgba(0,0,0,0)`;
    }
}

function determineColorFromPropsDefault(props: RootProps) {
    switch(props.buttonType) {
        case buttonType.neutral:
            return `inherit`;
        default:
            return readableColor(determineBackgroundFromProps(props)); 
    }
}

// most of our premade themes will want white text on buttons, if not we can change this later
function determineColorFromPropsPremade(props: RootProps) {
    switch(props.buttonType) {
        case buttonType.neutral:
            return `inherit`;
        default:
            return 'white'; 
    }
}

function determineColorFromProps(props: RootProps) {
    switch(props.theme.theme) {
        case 'dark':
            return determineColorFromPropsPremade(props);
        case 'light':
            return determineColorFromPropsPremade(props);
        case 'sea':
            return determineColorFromPropsPremade(props);
        default:
            return determineColorFromPropsDefault(props);
    }
}

const Root = styled.button`
    display: inline-block;
    border: none;
    padding: ${(props: RootProps) => props.inText ? `0px ${props.theme.minimumSpacing}` : `0px`};
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
    margin: 0px ${props => props.theme.minimumSpacing} 0px 0px;
`

const Text = styled.span`

`

interface ButtonProps {
    disabled?: boolean
    icon?: string
    text?: string
    type: buttonType
    inText?: boolean
}

export const Button: React.SFC<ButtonProps> = ({disabled, type, icon, text, inText, ...otherProps}) => {
    return <Root disabled={disabled} buttonType={type} {...otherProps}>
        {icon ? 
            <Icon className={icon}></Icon> : ''
        }
        {text ? 
            <Text>{text}</Text> : ''
        }
    </Root>
}