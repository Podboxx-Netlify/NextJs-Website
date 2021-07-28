import Header from './header'
import Footer from './footer'
import React from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

export default function Layout({...props}) {
    return (
        <div className="flex flex-col min-h-screen bg-03dp">
            <ToastContainer />
            <Header data={props.website}/>
            <div className='container mx-auto flex-grow'>
                {props.children}
            </div>
            <Footer data={props.website}/>
        </div>
    );
}