import React, {useEffect, useReducer} from 'react';
import UserReducer from "./user-reducer";
import JtockAuth from "j-tockauth";
import useSWR from "swr";
import fetcher from "../../libs/fetcher"

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
        if (typeof window !== 'undefined') {
            fetchChannel()
        }
    }, [])

    const isAuth = () => {
        const auth = new JtockAuth({
            host: process.env.NEXT_PUBLIC_API_URL,
            prefixUrl: `${localStorage.getItem('channel')}/subscribers`,
            debug: false
        });
        localStorage.getItem('J-tockAuth-Storage') !== null &&
        userDispatch({type: 'LOADING'})
        auth.validateToken(auth.tokenHeaders()).then(r => userDispatch({
            type: 'VERIFY_LOGIN',
            user: r.data
        })).catch(() => localStorage.getItem('J-tockAuth-Storage') !== null && auth.signOut())
    }

    const fetchChannel = () => {
        localStorage.getItem('channel') !== null && localStorage.getItem('channel') !== userState.channel &&
        userDispatch({type: 'FETCH_CHANNEL', channel: localStorage.getItem('channel')});
        localStorage.getItem('channel') !== null && isAuth()
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