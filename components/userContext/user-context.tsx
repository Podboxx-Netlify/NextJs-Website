import React, {useEffect, useReducer} from 'react';
import UserReducer from "./user-reducer";
import JtockAuth from "j-tockauth";

export interface Props {
    userState?: { isLoading: boolean; isLogged: boolean; user: {}; error: boolean; channel: number | string; subscriptions: string[] }
    userDispatch?: React.Dispatch<any>
    isLoading: boolean
    isLogged: boolean
    user: {}
    channel: number | string
    subscriptions: string[]
    error: boolean
}

const initialState = {
    isLoading: false,
    isLogged: false,
    user: {},
    channel: null,
    subscriptions: [],
    error: false
}

const UserProvider = ({children}) => {
    const [userState, userDispatch] = useReducer(UserReducer, initialState)

    useEffect(() => {
        fetchChannel()
    }, [])

    const isAuth = () => {
        const auth = new JtockAuth({
            host: process.env.NEXT_PUBLIC_API_URL,
            prefixUrl: `${userState.channel}/subscribers`,
            debug: true
        });
        localStorage.getItem('J-tockAuth-Storage') !== null &&
        userDispatch({type: 'LOADING'})
        auth.validateToken(auth.tokenHeaders()).then(r => userDispatch({
            type: 'VERIFY_LOGIN',
            user: r.data
        })).catch(() => userDispatch({type: 'ERROR'}))
    }

    const fetchChannel = () => {
        if (typeof window !== 'undefined') {
            localStorage.getItem('channel') !== null &&
            userDispatch({type: 'FETCH_CHANNEL', channel: localStorage.getItem('channel')});
            userState.channel !== null && isAuth()
        }
    }

    return (
        // @ts-ignore
        <UserContext.Provider value={{userState, userDispatch}}>
            {children}
        </UserContext.Provider>
    )
}
const UserContext = React.createContext<Props>(initialState)
const UserConsumer = UserContext.Consumer
export default UserProvider
export {
    UserConsumer,
    UserContext
}