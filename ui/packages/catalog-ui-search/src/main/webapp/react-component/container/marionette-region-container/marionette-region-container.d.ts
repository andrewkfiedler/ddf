import * as styled from 'styled-components'
import * as React from 'react'
import * as Backbone from 'backbone'

export interface MarionetteRegionContainerProps {
    view: Backbone.View<Backbone.Model>;
    viewOptions: object
}

declare class MarionetteRegionContainer extends React.Component<MarionetteRegionContainerProps> {}

export default MarionetteRegionContainer