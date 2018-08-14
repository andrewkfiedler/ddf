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
import WorkspacesTemplatesContainer from '../../container/workspaces-templates-container';
import WorkspacesItemsContainer from '../../container/workspaces-items-container';
import Button from '../button';

const Root = styled.div`
    ${CustomElement}
    ${props => ChangeBackground(props.theme.backgroundContent)}
    > .home-content,
    > .home-save {
        display: inline-block;
        width: 100%;
        vertical-align: top;
    }

    .home-content {
        max-height: 100%;
        overflow: auto;
    }

    .home-items {
        transition: padding ${props => props.theme.coreTransitionTime} ease-out ${props => props.theme.coreTransitionTime};
        padding-bottom: ${props => props.theme.minimumButtonSize};
    }

    .home-save {
        position: relative;
        left: 0px;
        opacity: 1;
        transform: scale(1) translateY(-100%);
        opacity: 1;
        transition: transform ${props => props.theme.coreTransitionTime} ease-out, 
            opacity ${props => props.theme.coreTransitionTime} ease-out,
            left 0s ease-out ${props => props.theme.coreTransitionTime};
    }

    ${props => {
        if (props.hasTemplatesExpanded) {
            return `
                .home-content {
                    overflow: hidden;
                }

                .home-save {
                    transform: translateY(100%);
                }
            `
        }
    }}

    ${props => {
        if (!props.hasUnsaved) {
            return `
                .home-items  {
                    padding-bottom: 0px;
                }

                .home-save {
                    transform: scale(2) translateY(-100%);
                    left: -200%;
                    opacity: 0;
                }
            `
        }
    }}
`

const Workspaces =  (props) => {
    return (
        <Root hasUnsaved={props.hasUnsaved} hasTemplatesExpanded={props.hasTemplatesExpanded}>
            <div className="home-content">
                <div className="home-templates">
                    <WorkspacesTemplatesContainer 
                        closeTemplates={props.closeTemplates}
                        hasUnsaved={props.hasUnsaved} 
                        hasTemplatesExpanded={props.hasTemplatesExpanded} 
                        toggleExpansion={props.toggleExpansion} />
                </div>
                <div className="home-items">
                    <WorkspacesItemsContainer />
                </div>
            </div> 
            <Button
                type='positive'
                icon='fa fa-floppy-o'
                text='Save all'
                className="home-save"
                onClick={props.saveAllWorkspaces}
            />
        </Root>
    )
}

export default Workspaces