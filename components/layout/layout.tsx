import Head from 'next/head';
import React, {useContext, useEffect} from "react";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import useSWR from "swr";
import fetcher from "../../libs/fetcher";
import {Props, UserContext} from "../userContext/user-context";
import Footer from './footer'
import Header from './header'

interface WebsiteData {
    title: string
    description: string
    my_podboxx: {
        id: number
        title: string
        fb_url: string
        apple_url: string
        google_url: string
        header_url: string
        spotify_url: string
        twitter_url: string
        youtube_url: string
        linkedin_url: string
    }
    channels: Channel[]
}

interface Channel {
    id: number
    title: string
    subscription_required: boolean
}

export type {WebsiteData}

export default function Layout({...props}) {
    const {userState} = useContext<Props>(UserContext)
    const {data} = useSWR<WebsiteData>(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/website`, fetcher)

    useEffect(() => {
        data && localStorage.getItem('channel') === null && defaultChannel()
    }, [data])

    const defaultChannel = () => {
        let channel_id = data?.channels.find(c => c?.subscription_required === false).id
        localStorage.setItem('channel', channel_id?.toString())
    }

    if (!data) return <div className="cover-spin" id='cover-spin'/>
    return (
        <div className="flex flex-col min-h-screen min-w-screen bg-03dp">
            <Head>
                <title>{data?.title || 'Error'}</title>
                <meta charSet="utf-8"/>
            </Head>
            <ToastContainer/> {/* => Notifications */}
            <Header data={data}/>
            <div className='container mx-auto flex-grow'>
                {props.children}
            </div>
            <Footer data={data}/>
            {userState.isLoading && <div className="cover-spin" id='cover-spin'/>}
        </div>
    );
}
