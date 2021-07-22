import React, {useEffect, useReducer} from 'react';
import UserReducer from "./user-reducer";
import JtockAuth from "j-tockauth";
import Axios from "axios";
import {DeviseHeader} from "j-tockauth/src/@types/options";

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
    const isLogged = () => {
        let headers;
        if (typeof window !== 'undefined') {
            const auth = new JtockAuth({
                host: "https://3b8c4cc9dda0.ngrok.io",
                prefixUrl: `/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers`,
                debug: true
            });
            headers = auth.tokenHeaders()
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await Axios.get(`https://3b8c4cc9dda0.ngrok.io/api/1/subscribers/profile`, {
                        params: {
                            uid: headers.uid,
                            client: headers.client,
                            "access-token": headers["access-token"]
                        }
                    });
                    console.log(response.headers);
                    resolve(response.data);
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
    const isAuth = () => {
        if (typeof window !== 'undefined') {
            const auth = new JtockAuth({
                host: "https://3b8c4cc9dda0.ngrok.io",
                prefixUrl: `/api/1/subscribers`,
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
        // isLogged().then(r => console.log(r))
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