import React from 'react'
import {shallow} from 'enzyme'
import BlogPost from '../../../pages/post/[id]'
import {mockNextUseRouter} from "../../../__mocks__/routerMock";

describe('BlogPost', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<BlogPost/>);
    })

    it('should render without crashing', () => {
        expect(wrapper).toMatchSnapshot();
    })

    it('Page should be loading', () => {
        mockNextUseRouter({
            route: "/post/667",
            pathname: "/post/[id]",
            query: {"id": "667"},
            asPath: "/post/667",
        });
        expect(wrapper.contains(<div className="cover-spin" id="cover-spin"/>)).toEqual(true);
    })
})