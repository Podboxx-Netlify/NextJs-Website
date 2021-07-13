// import React, {useReducer} from 'react';
// import UserReducer from "./user-reducer";
//
// interface Props {
//     isLoading?: boolean
//     isLogged?: boolean
//     user?: {}
//     error?: boolean
// }
//
// const initialState = {
//     isLoading: false,
//     isLogged: false,
//     user: {},
//     error: false
// }
//
// const UserProvider = ({ children }) => {
//     const [userState, userDispatch] = useReducer(UserReducer,initialState)
//     const value = {userState, userDispatch}
//     return (
//         <UserContext.Provider value={value}>
//             {children}
//         </UserContext.Provider>
//     )
// }
// export const UserContext = React.createContext(initialState)
// export default UserProvider
export {}