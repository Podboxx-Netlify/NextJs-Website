import React, {useEffect, useReducer} from 'react';
import UserReducer from "./user-reducer";
import JtockAuth from "j-tockauth";

export interface Props {
    userState?: { isLoading: boolean; isLogged: boolean; user: {}; error: boolean; }
    userDispatch?: React.Dispatch<any>
    isLoading: boolean
    isLogged: boolean
    user: {}
    error: boolean
}

const initialState = {
    isLoading: false,
    isLogged: false,
    user: {},
    error: false
}

const UserProvider = ({children}) => {
    const [userState, userDispatch] = useReducer(UserReducer, initialState)
    const isAuth = () => {
        if (typeof window !== 'undefined') {
            const auth = new JtockAuth({
                host: "http://127.0.0.1:4000",
                prefixUrl: `/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers`,
                debug: true
            });
            localStorage.getItem('J-tockAuth-Storage') !== null &&
            auth.validateToken(auth.tokenHeaders()).then(r => userDispatch({
                type: 'SIGN_IN',
                user: r.data
            })).catch(() => userDispatch({type: 'ERROR'}))

        }
    }
    useEffect(() => {
        isAuth()
    }, [])
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