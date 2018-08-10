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
import UnsavedIndicator from '../unsaved-indicator';
const SlideoutLeftViewInstance = require('component/singletons/slideout.left.view-instance.js');
const NavigatorView = require('component/navigator/navigator.view');

const Root = styled.div`
    position: relative;
    overflow: hidden;
    cursor: pointer;
    width: ${props => {
        if (props.hasLogo) {
            if (props.hasUnavailable || props.hasUnsaved) {
                return `calc(2*${props.theme.minimumButtonSize} + 1rem)`
            } else {
                return props.theme.multiple(2, props.theme.minimumButtonSize);
            }
        } else if (props.hasUnavailable || props.hasUnsaved) {
            return `calc(${props.theme.minimumButtonSize} + 1rem)`;
        } else {
            return props.theme.minimumButtonSize;
        }
    }};
    transition: ${props => `width ${props.theme.coreTransitionTime} ease-out`}
    
    button {
        text-align: center;
        width: ${props => {
            return props.theme.minimumButtonSize  
        }};
        height: 100%;
        padding-right: 0rem;
    }

    button > .navigation-sources {
        position: absolute;
        left: ${props => props.theme.minimumButtonSize};
        top: ${props => props.theme.minimumSpacing};
        color: ${props => props.theme.warningColor};

        .fa-cloud:nth-of-type(2) {
            position: absolute;
            left: 50%;
            top: 65%;
            transform: translateY(-50%) translateX(-50%) rotate(180deg);
        }

        .fa-bolt {
            left: 50%;
            top: 57%;
            transform: translateY(-50%) translateX(-50%) rotate(10deg) scale(.8);
            position: absolute;
            color: ${props => props.theme.warningColor}
        }
    }

    button > .navigation-multiple {
        position: absolute;
        left: ${props => props.theme.minimumButtonSize};
        top: ${props => props.theme.minimumSpacing};
        color: ${props => props.theme.warningColor};
    }
    
    .navigation-multiple,
    .navigation-sources {
        opacity: 0;
        transform: scale(2);
        transition: ${props => {
            return `transform ${props.theme.coreTransitionTime} ease-out, opacity ${props.theme.coreTransitionTime} ease-out;`
        }}
    }

    &.has-logo {
        img {
            max-width: ${props => props.theme.minimumButtonSize};
            max-height: ${props => props.theme.minimumButtonSize};
            vertical-align: top;
            position: relative;
            top: 50%;
            transform: translateY(-50%) translateX(0);
            transition: ${props => {
                return `transform ${props.theme.coreTransitionTime} ease-out;`
            }}
        }

        &.has-unavailable,
        &.has-unsaved {
            img {
                transform: translateY(-50%) translateX(1rem);
            }
        }
    }

    &.has-unavailable {
        .navigation-sources {
            opacity: 1;
            transform: scale(1);
        }
    }

    &.has-unsaved {
        .navigation-indicator {
            opacity: 1;
            transform: scale(1);
        }
    }

    &.has-unavailable.has-unsaved {
        .navigation-indicator, 
        .navigation-sources {
            opacity: 0;
            transform: scale(2);
        }

        .navigation-multiple {
            opacity: 1;
            transform: scale(1);
        }
    }
`

const handleUnsaved = (props, classes) => {
    if (props.hasUnsaved) {
        classes.push('has-unsaved');
    }
}

const handleUnavailable = (props, classes) => {
    if (props.hasUnavailable) {
        classes.push('has-unavailable');
    }
}

const getClassesFromProps = (props) => {
    const classes = [];
    handleUnsaved(props, classes);
    handleUnavailable(props, classes);
    return classes.join(' ');
}

const openNavigator = () => {
    SlideoutLeftViewInstance.updateContent(new NavigatorView());
    SlideoutLeftViewInstance.open();
}

export default function NavigationLeft(props) {
    return (
        <Root className={`${getClassesFromProps(props)} is-button is-img`} {...props} onClick={() => openNavigator()}>
            <button data-help="Click here to bring up the navigator.">
                <span className="fa fa-bars" />
                <UnsavedIndicator shown={props.hasUnsaved && !props.hasUnavailable}/>
                <span className="navigation-sources fa fa-bolt"/>
                <span className="navigation-multiple fa fa-exclamation"/>
            </button>
            {
                props.showLogo ? 
                <img className="logo" src="{{getImageSrc logo}}"/> : null
            }
        </Root>
    )
}