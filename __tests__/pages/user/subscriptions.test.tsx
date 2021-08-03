import React from 'react'
import {shallow} from 'enzyme'
import Subscriptions from '../../../pages/user/subscriptions'
import {mockNextUseRouter} from "../../../__mocks__/routerMock";
import {act} from "react-dom/test-utils";

describe('Subscriptions', () => {
    let wrapper;
    jest.setTimeout(30000);
    beforeEach(() => {
        wrapper = shallow(<Subscriptions/>);
    })

    it('should render without crashing', () => {
        expect(wrapper).toMatchSnapshot();
    })

    // it('Page should be loading for 5sec then redirect to login', async () => {
    //     // jest.useFakeTimers();
    //
    //     await page.goto('http://localhost:5000/user/login')
    //     await expect(page).toMatch('login')
    //
    //     // act(() => {
    //     //     jest.advanceTimersByTime(6000)
    //     // })
    //
    //     // expect(wrapper.contains(<div className="cover-spin" id="cover-spin"/>)).toEqual(false);
    //     // expect(setTimeout).toHaveBeenCalledTimes(1)
    // })
})