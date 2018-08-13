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
import Workspaces from '../../presentation/workspaces'

const Backbone = require('backbone');
const store = require('js/store');

function hasUnsaved() {
    return store.get('workspaces').find(function(workspace){
        return !workspace.isSaved();
    })
}

class WorkspacesContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasUnsaved: hasUnsaved(),
            hasTemplatesExpanded: false
        }
    }
    closeTemplates() {
        this.setState({
            hasTemplatesExpanded: false
        })
    }
    toggleExpansion() {
        this.setState({
            hasTemplatesExpanded: !this.state.hasTemplatesExpanded
        })
    }
    componentDidMount() {
        this.backbone = new Backbone.Model({});
        this.backbone.listenTo(store.get('workspaces'), 'change:saved update add remove', this.handleSaved.bind(this));
    }
    componentWillUnmount() {
        this.backbone.stopListening();
    }
    handleSaved() {
        this.setState({
            hasUnsaved: hasUnsaved()
        });
    }
    render() {
        return (
            <Workspaces 
                closeTemplates={this.closeTemplates.bind(this)}
                hasUnsaved={this.state.hasUnsaved} 
                hasTemplatesExpanded={this.state.hasTemplatesExpanded}
                toggleExpansion={this.toggleExpansion.bind(this)}
            />
        )
    }
}

export default WorkspacesContainer