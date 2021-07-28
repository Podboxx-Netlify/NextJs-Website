import '../styles/globals.scss'
import NProgress from 'nprogress'
import Router from 'next/router'
import Layout from "../components/layout/layout";
import React from "react";
import UserProvider from "../components/userContext/user-context";
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({Component, pageProps, websiteData}) {
    return (
        <UserProvider>
                <Layout website={websiteData}>
                    <title>{websiteData && websiteData.title || 'Error'}</title>
                    <Component {...pageProps} website={websiteData}/>
                </Layout>
        </UserProvider>
    )
}

MyApp.getInitialProps = async (Component, ctx) => {
    const websiteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/website`)
    let websiteData;
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    if (websiteRes.status !== 200) {
        websiteData = {}
    } else {
        websiteData = await websiteRes.json()
    }
    return {pageProps, websiteData};
}

export default MyApp

