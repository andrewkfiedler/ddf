import styled from 'styled-components'

function createMixin(styledComponent) {
    const validRules = styledComponent.componentStyle.rules.filter((rule) => typeof rule === 'string');
    const mixin = validRules.reduce((prevString, currString) => prevString + currString, '');
    if (validRules.length !== styledComponent.componentStyle.rules.length) {
        throw `Invalid rule found for mixin: ${mixin}`
    }
    return mixin;
}

export default createMixin