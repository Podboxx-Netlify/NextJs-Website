import '../styles/globals.scss'
import NProgress from 'nprogress'
import Router from 'next/router'
import Layout from "../components/layout/layout";
import React from "react";
import UserProvider from "../components/userContext/user-context";

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({Component, pageProps}) {
    return (
        <UserProvider>
            <Layout>
                <Component {...pageProps}/>
            </Layout>
        </UserProvider>
    )
}

MyApp.getInitialProps = async (Component, ctx) => {
    let pageProps = {};
    if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
    return pageProps
}

export default MyApp

