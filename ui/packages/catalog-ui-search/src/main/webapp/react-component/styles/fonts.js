import styled from 'styled-components'
import createMixin from './mixin';

const isBold = createMixin(styled.div `
    font-weight: bolder;
`)

const isNotBold = createMixin(styled.div `
    font-weight: lighter;
`)

const isSmallFont = createMixin(styled.div `
    font-weight: bolder;
`)

const isMediumFont = createMixin(styled.div `
    font-weight: bolder;
`)

const isLargeFont = createMixin(styled.div `
    font-weight: bolder;
`)

const isCentered = createMixin(styled.div `
    font-weight: bolder;
`)

const isSansSerif = createMixin(styled.div `
    font-weight: bolder;
`)

const isMonospaced = createMixin(styled.div `
    font-weight: bolder;
`)

export {
    isBold,
    isNotBold,
    isSmallFont,
    isMediumFont,
    isLargeFont,
    isCentered,
    isSansSerif,
    isMonospaced 
};