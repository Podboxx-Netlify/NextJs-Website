import React from 'react'
import {shallow} from 'enzyme'
import Login from '../../../pages/user/login'

describe('Login', () => {
    jest.setTimeout(30000);
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Login/>);
    })

    it('should render without crashing', () => {
        expect(wrapper).toMatchSnapshot();
    })


})