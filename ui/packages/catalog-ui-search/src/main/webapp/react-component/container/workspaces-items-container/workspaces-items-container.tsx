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
const Backbone = require('backbone');
import { sortBy } from 'lodash';
import WorkspacesItems from '../../presentation/workspaces-items';
import MarionetteRegionContainer from '../../container/marionette-region-container';

const FilterDropdownView = require('component/dropdown/workspaces-filter/dropdown.workspaces-filter.view');
const SortDropdownView = require('component/dropdown/workspaces-filter/dropdown.workspaces-filter.view');
const DisplayDropdownView = require('component/dropdown/workspaces-display/dropdown.workspaces-display.view');
const user = require('component/singletons/user-instance');
const store = require('js/store');

const preferences = user.get('user').get('preferences');

interface State {
    filterDropdown: Marionette.View<any>;
    sortDropdown: Marionette.View<any>;
    displayDropdown: Marionette.View<any>;
    byDate: boolean;
    workspaces: Array<Backbone.Model[keyof Backbone.Model]>
}

function filterWorkspaces(workspaces: Backbone.Collection<Backbone.Model>) {
    return workspaces.filter((workspace: Backbone.Model) => {
        const localStorage = workspace.get('localStorage') || false;
        const owner = workspace.get('metacard.owner');
        const email = user.get('user').get('email');

        switch (preferences.get('homeFilter')) {
            case 'Not owned by me':
                return !localStorage && email !== owner;
            case 'Owned by me':
                return localStorage || email === owner;
            case 'Owned by anyone':
            default:
                return true;
        }
    })
}

function sortWorkspaces(workspaces: Backbone.Model[]) {
    return sortBy(workspaces, (workspace: Backbone.Model) => {
        switch (preferences.get('homeSort')) {
            case 'Title':
                return workspace.get('title').toLowerCase();
            default:
                return -workspace.get('metacard.modified');
        } 
    }) 
}

function determineWorkspaces(workspaces: Backbone.Collection<Backbone.Model>) {
    return sortWorkspaces(filterWorkspaces(workspaces))
}

class WorkspacesItemsContainer extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            filterDropdown: FilterDropdownView.createSimpleDropdown({
                list: [
                    {
                        label: 'Owned by anyone',
                        value: 'Owned by anyone',
                    },
                    {
                        label: 'Owned by me',
                        value: 'Owned by me',
                    },
                    {
                        label: 'Not owned by me',
                        value: 'Not owned by me',
                    }
                ],
                defaultSelection: [preferences.get('homeFilter')]
            }),
            sortDropdown: SortDropdownView.createSimpleDropdown({
                list: [
                    {
                        label: 'Last modified',
                        value: 'Last modified',
                    },
                    {
                        label: 'Title',
                        value: 'Title',
                    }
                ],
                defaultSelection: [preferences.get('homeSort')]
            }),
            displayDropdown: DisplayDropdownView.createSimpleDropdown({
                list: [
                    {
                        label: 'Grid',
                        value: 'Grid',
                    },
                    {
                        label: 'List',
                        value: 'List',
                    }
                ],
                defaultSelection: [preferences.get('homeDisplay')]
            }),
            byDate: preferences.get('homeSort') === 'Last modified',
            workspaces: determineWorkspaces(store.get('workspaces'))
        }
    }
    backbone = new Backbone.Model({});
    componentDidMount() {
        this.backbone.listenTo(store.get('workspaces'), 'add reset remove', this.updateWorkspaces.bind(this));
        this.backbone.listenTo(preferences, 'change:homeFilter', this.updateWorkspaces.bind(this));
        this.backbone.listenTo(preferences, 'change:homeSort', this.handleSort.bind(this));
        this.backbone.listenTo(this.state.sortDropdown.model, 'change:value', this.save('homeSort'));
        this.backbone.listenTo(this.state.displayDropdown.model, 'change:value', this.save('homeDisplay'));
        this.backbone.listenTo(this.state.filterDropdown.model, 'change:value', this.save('homeFilter'));
    }
    updateWorkspaces() {
        this.setState({
            workspaces: determineWorkspaces(store.get('workspaces'))
        })
    }
    handleSort() {
        this.setState({
            workspaces: determineWorkspaces(store.get('workspaces')),
            byDate: preferences.get('homeSort') === 'Last modified'
        })
    }
    save(key: string) {
        return function (_unused_model: any, value: any) {
            var prefs = user.get('user').get('preferences');
            prefs.set(key, value[0]);
            prefs.savePreferences();
        };
    }
    componentWillUnmount() {
        this.backbone.stopListening();
    }
    render() {
        return (
            <WorkspacesItems 
                byDate={this.state.byDate}
                filterDropdown={<MarionetteRegionContainer view={this.state.filterDropdown} />}
                sortDropdown={<MarionetteRegionContainer view={this.state.sortDropdown}/>}
                displayDropdown={<MarionetteRegionContainer view={this.state.displayDropdown}/>}
                workspaces={this.state.workspaces}
            />
        )
    }
}

export default WorkspacesItemsContainer