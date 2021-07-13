import '../styles/globals.scss'
import NProgress from 'nprogress'
import Router from 'next/router'
import Layout from "../components/layout/layout";
import React from "react";
// import {UserContext} from "../components/userContext/user-context";

Router.events.on('routeChangeStart', (url) => {
    console.log(`Loading: ${url}`)
    NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({Component, pageProps, websiteData}) {
    return (
        // <UserContext>
        <Layout website={websiteData}>
            <title>{websiteData && websiteData.title || 'Error'}</title>
            <Component {...pageProps} website={websiteData}/>
        </Layout>
        // </UserContext>
    )
}

MyApp.getInitialProps = async (Component, ctx) => {
    // const res = await fetch(`http://localhost:4000/api/${process.env.station_id}/website`)
    const websiteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.station_id}/website`)
    const websiteData = await websiteRes.json()
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return {pageProps, websiteData};
}

export default MyApp

