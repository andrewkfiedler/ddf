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
import { keyframes } from 'styled-components'
import { CustomElement } from '../../styles/customElement';
import { ChangeBackground } from '../../styles/changeBackground';
import { transparentize, readableColor } from 'polished';

const HelpView = require('component/help/help.view');
const UserSettings = require('component/user-settings/user-settings.view');
const UserNotifications = require('component/user-notifications/user-notifications.view');
const UserView = require('component/user/user.view');
const SlideoutViewInstance = require('component/singletons/slideout.view-instance.js');
const SlideoutRightViewInstance = require('component/singletons/slideout.right.view-instance.js');
const user = require('component/singletons/user-instance');
const notifications = require('component/singletons/user-notifications');

const navigationRightUserIcon = '1.375rem';
const unseenNotifications = keyframes`
    0% {
        opacity: ${props => props.theme.minimumOpacity};
        transform: scale(1);
    }
    100% {
        opacity: 1;
        transform: scale(1.2);
    }
`

const Root = styled.div`
    .customElement;
    white-space: nowrap;
    overflow: hidden;

    .navigation-item {
        display: inline-block;
        width: ${props => props.theme.minimumButtonSize};
        height: 100%;
        text-align: center;
        vertical-align: top;
    }

    .navigation-item.item-user {
        padding: 0px ${props => props.theme.minimumSpacing};
        max-width: 9rem + ${navigationRightUserIcon};
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .alerts-badge {
        position: absolute;
        font-size: ${props => props.theme.minimumFontSize};
        top: 35%;
        transform: scale(0) translateY(-50%);
        transition: transform ${props => props.theme.coreTransitionTime} ease-in-out;
        color: ${props => props.theme.warningColor};
    }

    .item-alerts {
        transition: transform 4*${props => props.theme.coreTransitionTime} ease-in-out;
        transform: scale(1);
    }

    .user-unique {
        white-space: nowrap;
        vertical-align: top;
        position: relative;
    }

    .user-unique span:first-of-type {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
        max-width: 9rem - ${navigationRightUserIcon};
        padding-right: ${navigationRightUserIcon};
    }

    .user-unique span:nth-of-type(2){
        position: absolute;
        right: 0px;
        top: 50%;
        display: inline-block;
        width: ${navigationRightUserIcon};
        line-height: inherit !important;
        vertical-align: top;
        transform: translateY(-50%);
    }

    &.is-guest {
        .user-unique {
            display: none;
        }
    }

    &:not(.is-guest) {
        .user-guest {
            display: none;
        }
    }

    &.has-unseen-notifications {
        .item-alerts {
            opacity: 1;
            animation: ${unseenNotifications} 4*${props => props.theme.coreTransitionTime} 5 alternate ease-in-out;
            transform: scale(1.2);
        }

        .alerts-badge {
            transform: scale(1) translateY(-50%);
        }
    }
`

const handleUser = (props, classes) => {
    if (user.isGuest()) {
        classes.push('is-guest');
    }
}

const handleUnseenNotifications = (props, classes) => {
    if (notifications.hasUnseen()) {
        classes.push('has-unseen-notifications');
    }
}

const toggleAlerts = () => {
    SlideoutRightViewInstance.updateContent(new UserNotifications());
    SlideoutRightViewInstance.open();
}

const toggleHelp = () => {
    HelpView.toggleHints();
} 

const toggleUserSettings = () => {
    SlideoutViewInstance.updateContent(new UserSettings());
    SlideoutViewInstance.open();
}

const toggleUser = () => {
    SlideoutRightViewInstance.updateContent(new UserView());
    SlideoutRightViewInstance.open();
}

const getClassesFromProps = (props) => {
    const classes = [];
    handleUser(props, classes);
    handleUnseenNotifications(props, classes);
    return classes.join(' ');
}

export default function NavigationLeft(props) {
    return (
        <Root className={`${getClassesFromProps(props)}`}>
            <button className="navigation-item item-help is-button" title="Shows helpful hints in the current context.">
                <span className="fa fa-question"></span>
            </button>
            <button className="navigation-item item-settings is-button" title="Shows settings for the application.">
                <span className="fa fa-cog"></span>
            </button>
            <button className="navigation-item item-alerts is-button" title="Shows notifications.">
                <span className="fa fa-bell"></span>
                <span className="alerts-badge fa fa-exclamation"></span>
            </button>
            <button className="navigation-item item-user is-button">
                <div className="user-unique" title=`Logged in as ${user.getUserName()}`>
                    <span className="">{user.getUserName()}</span>
                    <span className="fa fa-user"></span>
                </div>
                <div className="user-guest" title="Logged in as guest."> 
                    <span className="">Sign In</span>
                </div>
            </button>
        </Root>
    )
}