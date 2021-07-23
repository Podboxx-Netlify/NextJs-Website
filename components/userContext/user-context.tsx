import React, {useEffect, useReducer} from 'react';
import UserReducer from "./user-reducer";
import JtockAuth from "j-tockauth";

export interface Props {
    userState?: { isLoading: boolean; isLogged: boolean; user: {}; error: boolean; channel: number | string }
    userDispatch?: React.Dispatch<any>
    isLoading: boolean
    isLogged: boolean
    user: {}
    channel: number | string
    error: boolean
}

const initialState = {
    isLoading: false,
    isLogged: false,
    user: {},
    channel: null,
    error: false
}

const UserProvider = ({children}) => {
    const [userState, userDispatch] = useReducer(UserReducer, initialState)
    // const isLogged = () => {
    //     let headers;
    //     if (typeof window !== 'undefined') {
    //         const auth = new JtockAuth({
    //             host: process.env.NEXT_PUBLIC_API_URL,
    //             prefixUrl: `${process.env.NEXT_PUBLIC_STATION_ID}/subscribers`,
    //             debug: true
    //         });
    //         headers = auth.tokenHeaders()
    //         return new Promise(async (resolve, reject) => {
    //             try {
    //                 const response = await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}1/subscribers/profile`, {
    //                     params: {
    //                         uid: headers.uid,
    //                         client: headers.client,
    //                         "access-token": headers["access-token"]
    //                     }
    //                 });
    //                 console.log(response.headers);
    //                 resolve(response.data);
    //             } catch (err) {
    //                 reject(err);
    //             }
    //         });
    //     }
    // }
    const isAuth = () => {
        if (typeof window !== 'undefined') {
            const auth = new JtockAuth({
                host: process.env.NEXT_PUBLIC_API_URL,
                prefixUrl: `${userState.channel}/subscribers`,
                debug: true
            });
            userDispatch({type: 'LOADING'})
            localStorage.getItem('J-tockAuth-Storage') !== null &&
            auth.validateToken(auth.tokenHeaders()).then(r => userDispatch({
                type: 'VERIFY_LOGIN',
                user: r.data
            })).catch(() => userDispatch({type: 'ERROR'}))

        }
    }
    const fetchChannel = () => {
        if (typeof window !== 'undefined') {
            localStorage.getItem('channel') !== null &&
            userDispatch({type: 'FETCH_CHANNEL', channel: localStorage.getItem('channel')})
            isAuth()
        }
    }
    useEffect(() => {
        fetchChannel()
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