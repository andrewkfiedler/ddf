import * as styled from 'styled-components'
import * as React from 'react'
import * as Backbone from 'backbone'

export interface RouterComponentProps {
    isDrawing: boolean;
    hasUnavailable: boolean;
    hasUnsaved: boolean;
    hasLogo: boolean; 
    nav: React.Component;
    content: React.Component;
}

declare class RouterComponent extends React.PureComponent<RouterComponentProps> {}

export default RouterComponent