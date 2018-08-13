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
import MarionetteRegionContainer from '../../container/marionette-region-container';
const WorkspaceItemCollection = require('component/workspace-item/workspace-item.collection.view');
const store = require('js/store');

const Root = styled.div`
    ${CustomElement}
    position: relative;
    
    .home-items-center {
        max-width: 1200px;
        margin: auto;
        padding: 0px 100px;
    }

    .home-items-header {
        font-size: ${props => props.theme.minimumFontSize};
        font-weight: bolder;
        line-height: ${props => props.theme.minimumButtonSize};
    }

    .header-menu {
        float: right;
        text-align: center;
    }

    .menu-button {
        display: inline-block;
        padding: 0px 10px;
    }

    ${props => {
        if (props.theme.screenSize.includes('small')) {
            return `
                .home-items-center {
                    max-width: 100%;
                    padding: 0px 20px;
                }
                .home-items-choices {
                    text-align: center;
                }
            `
        }
    }}
`

const WorkspacesItems =  (props) => {
    return (
        <Root>
            <div className="home-items-center">
                <div className="home-items-header clearfix">
                    {
                        props.byDate ? 
                        <span className="header-hint by-date">
                            Recent workspaces
                        </span> : 
                        <span className="header-hint by-title">
                            Workspaces by title
                        </span>
                    }
                    <div className="header-menu">
                        <div className="menu-button home-items-filter">
                            <MarionetteRegionContainer 
                                view={props.filterDropdown}
                            />
                        </div>
                        <div className="menu-button home-items-sort">
                            <MarionetteRegionContainer 
                                view={props.displayDropdown}
                            />
                        </div>
                        <div className="menu-button home-items-display">
                            <MarionetteRegionContainer 
                                view={props.sortDropdown}
                            />
                        </div>
                    </div>
                </div>
                <div className="home-items-choices">
                    <MarionetteRegionContainer 
                        view={WorkspaceItemCollection}
                        viewOptions={() => {
                            return {
                                collection: store.get('workspaces')
                            }
                        }}
                    />
                </div>
            </div>
        </Root>
    )
}

export default WorkspacesItems