import Header from './header'
import Footer from './footer'
import React, {useEffect, useState} from "react";
import JtockAuth from "j-tockauth";
import UserProvider from "../userContext/user-context";

export default function Layout({...props}) {
    const [userData, setUserData] = useState()

    return (
        <UserProvider>
            <div className="flex flex-col min-h-screen bg-03dp">
                <Header data={props.website} userData={userData}/>
                <div className='container mx-auto flex-grow'>
                    {props.children}
                </div>
                <Footer data={props.website}/>
            </div>
        </UserProvider>
    );
}