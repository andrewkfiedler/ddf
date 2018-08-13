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
const Backbone = require('backbone');
import WorkspacesItem from '../../presentation/workspace-item';
const moment = require('moment');

const getStateFromWorkspace = (workspace) => {
    return {
        title: workspace.get('title'),
        date: moment(workspace.get('metacard.modified')).fromNow(),
        owner: workspace.get('metacard.owner') || 'Guest',
        unsaved: !workspace.isSaved(),
        localStorage: workspace.get('localStorage')
    }
}

class WorkspacesItemsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = getStateFromWorkspace(this.props.workspace);
    }

    componentDidMount() {
        this.backbone = new Backbone.Model({});
        this.backbone.listenTo(this.props.workspace, 'change', this.handleChange.bind(this));
    }
    componentWillUnmount() {
        this.backbone.stopListening();
    }
    handleChange() {
        this.setState(getStateFromWorkspace(this.props.workspace));
    }
    render() {
        return (
            <WorkspacesItem 
               title={this.state.title}
               date={this.state.date}
               owner={this.state.owner}
               unsaved={this.state.unsaved}
               localStorage={this.state.localStorage}
               workspace={this.props.workspace}
            />
        )
    }
}

export default WorkspacesItemsContainer