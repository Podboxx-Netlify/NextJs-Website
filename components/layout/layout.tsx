import Header from './header'
import Footer from './footer'
import React from "react";
// import UserProvider from '../userContext/user-context'

export default function Layout({...props}) {
    return (
        // <UserProvider>
        <div className="flex flex-col min-h-screen bg:white dark:bg-main-dark">
            <Header data={props.website}/>
            <div className='container mx-auto flex-grow'>
                {props.children}
            </div>
            {/*<VerticalAd/>*/}
            <Footer data={props.website}/>
        </div>
        // </UserProvider>
    );
}