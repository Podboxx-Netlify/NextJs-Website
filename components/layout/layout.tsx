import Header from './header'
import Footer from './footer'
import React, {useContext, useEffect, useState} from "react";
import JtockAuth from "j-tockauth";
import UserProvider, {Props, UserContext} from "../userContext/user-context";
import {useRouter} from "next/router";

export default function Layout({...props}) {


    // const router = useRouter();
    //     const {userState, userDispatch} = useContext<Props>(UserContext)
    //     const pathIsProtected = props.protectedRoutes.indexOf(router.pathname) !== -1;
    //
    //     useEffect(() => {
    //         if (!userState.isLoading && !userState.isLogged && pathIsProtected) {
    //             console.log('redirect', !userState.isLoading, !userState.isLogged, pathIsProtected)
    //             // Redirect route, you can point this to /login
    //             router.push('/user/login');
    //         }
    //     }, [userState.isLoading, pathIsProtected]);

    //     if ((userState.isLoading || !userState.isLogged) && pathIsProtected) {
    //         return <FullScreenLoader />;
    //     }
    //
    //     return children;

    return (
        <UserProvider>
            <div className="flex flex-col min-h-screen bg-03dp">
                <Header data={props.website}/>
                <div className='container mx-auto flex-grow'>
                    {props.children}
                </div>
                <Footer data={props.website}/>
            </div>
        </UserProvider>
    );
}