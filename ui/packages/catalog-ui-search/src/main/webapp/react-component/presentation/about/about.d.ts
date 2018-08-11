import * as styled from 'styled-components'
import * as React from 'react'
import * as Backbone from 'backbone'

export interface Props {
    branding: string;
    product: string;
    version: string;
    commitHash: string;
    isDirty: boolean;
    date: string;
}

declare class About extends React.PureComponent<Props> {}

export default About