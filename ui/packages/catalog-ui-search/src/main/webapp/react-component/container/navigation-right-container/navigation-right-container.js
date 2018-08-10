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
import NavigationRightComponent from '../../presentation/navigation-right'
const user = require('component/singletons/user-instance');
const notifications = require('component/singletons/user-notifications');
const Backbone = require('backbone');

class NavigationRightContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            isGuest: user.isGuest(),
            username: user.getUserName(),
            hasUnseenNotifications: notifications.hasUnseen()
        }
    }
    componentDidMount() {
        this.backbone = new Backbone.Model({});
        this.backbone.listenTo(notifications, 'change add remove reset update', this.handleUnseenNotifications.bind(this));
    }
    componentWillUnmount() {
        this.backbone.stopListening();
    }
    handleUnseenNotifications() {
        this.setState({
            hasUnseenNotifications: notifications.hasUnseen()
        })
    }
    render() {
        return (
            <NavigationRightComponent username={this.state.username} hasUnseenNotifications={this.state.hasUnseenNotifications} isGuest={this.state.isGuest}/>
        )
    }
}

export default NavigationRightContainer