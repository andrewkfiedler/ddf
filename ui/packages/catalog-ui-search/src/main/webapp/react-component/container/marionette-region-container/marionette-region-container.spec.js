import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'

import MarionetteRegionContainer from './index'

describe('<MarionetteRegionContainer />', () => {

    it('gets mounted', () => {
        sinon.spy(MarionetteRegionContainer.prototype, 'componentDidMount')
        const wrapper = mount(<MarionetteRegionContainer/>)
        expect(MarionetteRegionContainer.prototype.componentDidMount).to.have.property('callCount', 1)
        MarionetteRegionContainer.prototype.componentDidMount.restore()
    })
    
    it('renders a single div', () => {
        const wrapper = shallow(<MarionetteRegionContainer/>)
        expect(wrapper.find('div')).to.have.length(1)
    })

})