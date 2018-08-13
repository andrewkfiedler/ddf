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
import Card from '../card'
const DropdownModel = require('component/dropdown/dropdown');
const WorkspaceInteractionsDropdown = require('component/dropdown/workspace-interactions/dropdown.workspace-interactions.view');
import MarionetteRegionContainer from '../../container/marionette-region-container';

const Root = styled.div`
    .choice-title {
        > .title-text {
            white-space: pre;
            display: inline-block;
            max-width: calc(100% - ${props => props.theme.minimumFontSize});
            overflow: hidden;
            text-overflow: ellipsis;
        }
        > .title-indicator {
            display: inline-block;
            vertical-align: top;
        }
    }
`

const Interactions = styled.div`
    > * {
        display: inline-block;
        width: ${props => props.theme.minimumButtonSize};
        height: ${props => props.theme.minimumButtonSize};
    }
`

const Header = (props) => {
    return (
        <div className="choice-title" data-help="The title of the workspace.">
            <span className="title-text"> {props.title} </span>
            <div className="title-indicator"></div>
        </div>
    )
}

const Details = (props) => {
    return (
        <React.Fragment>
            <div className="choice-date" title={props.date} data-help="The date the workspace was last modified">
                {props.date}
            </div>
            <div className="choice-owner" title={props.owner} data-help="The owner of the workspace.">
                {props.localStorage ? 
                    <span className="fa fa-home"></span> : <span className="fa fa-cloud"></span>
                }
                <span className='owner-id'>
                    {props.owner}
                </span>
            </div>
        </React.Fragment>
    )
}

const Footer = (props) => {
    return (
        <Interactions>
            <MarionetteRegionContainer 
                view={WorkspaceInteractionsDropdown}
                viewOptions={() => {
                    return {
                        model: new DropdownModel(),
                        modelForComponent: props.workspace,
                        dropdownCompanionBehaviors: {
                            navigation: {}
                        }
                    }
                }}
            />
        </Interactions>
    )
}


const WorkspaceItem =  (props) => {
    return (
        <Root>
            <Card 
                header={Header(props)}
                details={Details(props)}
                footer={Footer(props)}
            />
        </Root>
    )
}

export default WorkspaceItem