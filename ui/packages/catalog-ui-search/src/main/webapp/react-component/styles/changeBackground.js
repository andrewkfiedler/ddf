import styled from 'styled-components'
import createMixin from './mixin';
import { readableColor } from 'polished';

const ChangeBackground = (newBackground) => {
    return createMixin(styled.div`
        background: ${newBackground};
        color: ${readableColor(newBackground)};
    `)
}

export { ChangeBackground };