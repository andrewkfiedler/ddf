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
import { readableColor, darken, shade, lighten, tint, opacify } from 'polished';

export enum buttonTypeEnum {
    neutral,
    positive,
    negative,
    primary
}

function determineBackgroundFromProps(props: RootProps) {
    switch(props.buttonType) {
        case buttonTypeEnum.positive:
            return props.theme.positiveColor;
        case buttonTypeEnum.negative:
            return props.theme.negativeColor;
        case buttonTypeEnum.primary:
            return props.theme.primaryColor;
        case buttonTypeEnum.neutral:
            return `rgba(0,0,0,0)`;
    }
}

function determineColorFromPropsDefault(props: RootProps) {
    switch(props.buttonType) {
        case buttonTypeEnum.neutral:
            return `inherit`;
        default:
            return readableColor(determineBackgroundFromProps(props)); 
    }
}

// most of our premade themes will want white text on buttons, if not we can change this later
function determineColorFromPropsPremade(props: RootProps) {
    switch(props.buttonType) {
        case buttonTypeEnum.neutral:
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

function shadeFromProps(amount: number, props: RootProps) {
    switch(props.buttonType) {
        case buttonTypeEnum.neutral:
            return shade(1-amount, opacify(.1, determineBackgroundFromProps(props)));
        default:
            return shade(amount, determineBackgroundFromProps(props))
    }
}

function tintFromProps(amount: number, props: RootProps) {
    switch(props.buttonType) {
        case buttonTypeEnum.neutral:
            return tint(1-amount, opacify(.1, determineBackgroundFromProps(props)));
        default:
            return tint(amount, determineBackgroundFromProps(props))
    }
}

interface RootProps {
    inText?: boolean,
    buttonType: buttonTypeEnum,
    theme?: any,
    fadeUntilHover?: boolean
}

const Root = styled.button`
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    border: none;
    padding: ${(props: RootProps) => props.inText ? `0px ${props.theme.minimumSpacing}` : `0px`};
    margin: ${props => props.inText ? `0px ${props.theme.minimumSpacing}` : `0px`};
    border-radius: ${props => props.theme.borderRadius};
    font-size: ${props => props.inText ? 'inherit !important' : props.theme.largeFontSize};
    line-height: ${props => props.inText ? 'inherit !important' : props.theme.minimumButtonSize};
    height: ${props => props.inText ? 'auto !important' : props.theme.minimumButtonSize};
    min-width: ${props => props.inText ? '0px !important' : props.theme.minimumButtonSize};
    min-height: ${props => props.inText ? '0px !important' : props.theme.minimumButtonSize};
    text-align: center;

    background: ${props => determineBackgroundFromProps(props)};
    color: ${props => determineColorFromProps(props)};

    opacity: ${props => props.fadeUntilHover ? props.theme.minimumOpacity : 1};

    &:hover:not([disabled]),
    &:focus:not([disabled]) {
        opacity: 1;
        background: ${props => shadeFromProps(0.9, props)};
        box-shadow: 0px 0px 2px ${props => shadeFromProps(0.9, props)};
    }

    &:active:not([disabled]) {
        opacity: 1;
        background: ${props => shadeFromProps(0.7, props)};
        box-shadow: 0px 0px 2px ${props => shadeFromProps(0.7, props)};
    }

    &:disabled {
        ${(props: RootProps) => {
            if (props.buttonType !== buttonTypeEnum.neutral) {
                return `text-shadow: 0px 0px 4px ${readableColor(determineColorFromProps(props))};`
            }
        }}
        background: repeating-linear-gradient(
                45deg,
                ${props => tintFromProps(0.9, props)},
                ${props => tintFromProps(0.9, props)} 10px,
                ${props => shadeFromProps(0.9, props)} 10px,
                ${props => shadeFromProps(0.9, props)} 20px
        );
        cursor: not-allowed;
    }
`

interface IconProps {
    text?: string,
    theme?: any
}

const Icon = styled.span`
    margin: 0px ${(props: IconProps) => (props.text !== undefined && props.text !== '') ? props.theme.minimumSpacing : '0px'} 0px 0px;
`

interface TextProps {
    inText?: boolean,
    theme?: any
}

const Text = styled.span`
    font-size: ${(props: TextProps) => props.inText ? 'inherit !important' : props.theme.largeFontSize};
`

interface BaseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    /**
     *  Disables the button.
     */
    disabled?: boolean
    /**
     *  Affects how the button is styled in terms of color
     */
    buttonType: buttonTypeEnum
    /**
     *  For buttons that are in the flow of text, like a highlighted word in a paragraph that's a button.
     */
    inText?: boolean
    /**
     *  Icon for the button, such as 'fa fa-home'.  For now this is a class.
     */
    icon?: string
    /**
     *  Text to appear within the button
     */
    text?: string
    /**
     * Whether to appear faded when not hovered (helps avoid distracting the user)
     */
    fadeUntilHover?: boolean
    /**
     * Use for a more custom button (avoid if possible!)
     */
    children?: React.ReactNode
}

interface IconButtonProps extends BaseButtonProps {
    icon: string
}

interface TextButtonProps extends BaseButtonProps {
    text: string
}

type ButtonProps = IconButtonProps | TextButtonProps | (IconButtonProps & TextButtonProps)

export const Button: React.SFC<ButtonProps> = ({children, disabled, buttonType, icon, text, inText, ...otherProps}) => {
    return <Root inText={inText} disabled={disabled} buttonType={buttonType} {...otherProps}>
        {                
            children ? children : ''
        }
        {
            !children && icon ? 
            <Icon text={text} className={icon}></Icon> : ''
        }
        {
            !children && text ? 
            <Text inText={inText} >{text}</Text> : ''
        }
    </Root>
}