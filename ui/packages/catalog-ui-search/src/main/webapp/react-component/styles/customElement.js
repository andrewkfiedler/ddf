import styled from 'styled-components'
import createMixin from './mixin';

const CustomElement = createMixin(styled.div`
    width: 100%;
    height: 100%;
    display: block;
`)

export {CustomElement};