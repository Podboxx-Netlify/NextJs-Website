import Header from './header'
import Footer from './footer'
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import {useContext} from "react";
import {Props, UserContext} from "../userContext/user-context";

export default function Layout({...props}) {
    const {userState} = useContext<Props>(UserContext)

    return (
        <div className="flex flex-col min-h-screen bg-03dp">
            <ToastContainer />
            {userState.isLoading && <div className="cover-spin" id='cover-spin'/>}
            <Header data={props.website}/>
            <div className='container mx-auto flex-grow'>
                {props.children}
            </div>
            <Footer data={props.website}/>
        </div>
    );
}