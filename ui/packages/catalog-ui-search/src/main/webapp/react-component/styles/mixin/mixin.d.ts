import * as styled from 'styled-components'
import * as React from 'react'

declare function createMixin(styledComponent: styled.StyledComponentClass<React.HTMLProps<HTMLElement>, any, React.HTMLProps<HTMLElement>>): string

export default createMixin