import * as React from 'react'

export interface Props {
    type: string;
    icon: string;
    text: string;
    disabled: boolean;
}

declare class Button extends React.PureComponent<Props> {}

export default Button