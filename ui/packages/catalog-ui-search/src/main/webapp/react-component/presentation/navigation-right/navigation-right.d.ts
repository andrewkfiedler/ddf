import * as React from 'react'

export interface Props {
    username: string;
    hasUnseenNotifications: boolean;
    isGuest: boolean;
}

declare class NavigationRight extends React.PureComponent<Props> {}

export default NavigationRight