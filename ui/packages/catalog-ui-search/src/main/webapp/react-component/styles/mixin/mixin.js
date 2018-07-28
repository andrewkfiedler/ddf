import styled from 'styled-components'

function createMixin(styledComponent) {
    return styledComponent.componentStyle.rules[0]
}

export default createMixin