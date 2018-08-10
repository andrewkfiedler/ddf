import * as React from 'react'

export interface Props {
    hasUnsaved: boolean;
    hasUnavailable: boolean;
    showLogo: boolean;
}

declare class NavigationLeft extends React.PureComponent<Props> {}

export default NavigationLeft