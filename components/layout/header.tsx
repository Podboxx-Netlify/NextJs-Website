import React, {useContext, useEffect, useState} from "react";
import Link from 'next/link'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faFacebookF,
    faGoogle,
    faItunes,
    faLinkedin,
    faSpotify,
    faTwitter,
    faYoutube
} from '@fortawesome/free-brands-svg-icons'
import {
    faBars,
    faCreditCard,
    faGem,
    faHome,
    faPodcast,
    faSignOutAlt,
    faUser,
    faUserEdit,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from "next/router";
import {Props, UserContext} from "../userContext/user-context";
import {signOut} from "../userContext/sign_out";
import Socials from "./socials";
import UserButton from './user-button'

export default function Header({...props}) {
    const router = useRouter()
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [isLogged, setIsLogged] = useState(userState.isLogged)
    const [currentChannel, setCurrentChannel] = useState(userState.channel)

    useEffect(() => {
        setCurrentChannel(userState.channel)
    }, [])

    useEffect(() => {
        setIsLogged(userState.isLogged)
    }, [userState.isLogged])

    useEffect(() => {
        currentChannel?.toString() !== userState?.channel?.toString() && setCurrentChannel(userState.channel)
    }, [userState.channel])

    const handleChannelChange = (id: string, premium?: boolean) => {
        localStorage.setItem('channel', id);
        userDispatch({type: 'FETCH_CHANNEL', channel: id.toString()});
        localStorage.getItem('J-tockAuth-Storage') !== null && signOut(userState.channel, userDispatch)
        router.replace({
            pathname: '/',
            query: {channel_id: id},
        }, '/').then()
    }

    const subscription_required = (e) => e.subscription_required === true

    return (
        <header className="sticky z-10 top-0 max-w-screen min-w-screen">
            <div className="navbar shadow-lg bg-16dp text-neutral-content h-24 ">

                <div className="px-2 mx-2 navbar-start">
                    <span className="text-lg font-bold select-none"><Link
                        href='/'>{props.data?.title || 'Loading...'}</Link></span>
                </div>

                <div className="navbar-center px-2 mx-2 lg:flex invisible md:visible hidden">
                    <div className="flex items-stretch invisible md:visible">
                        <UserButton onClick={() => router.replace('/')} icon={faHome}
                                    content={'Home'}/>
                        {props.data.channels.some(subscription_required) &&
                        <>
                            {isLogged ?
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap">
                                        <FontAwesomeIcon icon={faUser} className='mr-2' size='sm'/>My Account
                                    </div>
                                    <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-52">
                                        <li><a>
                                            <UserButton onClick={() => router.push('/user/profile')}
                                                        icon={faUserEdit} content={'Profile'} dropdown={true}/>
                                        </a></li>
                                        <li><a>
                                            <UserButton onClick={() => router.push('/user/subscriptions')}
                                                        icon={faCreditCard} content={'Subscriptions'} dropdown={true}/>
                                        </a></li>
                                        <li><a>
                                            <UserButton onClick={() => signOut(userState.channel, userDispatch)}
                                                        icon={faSignOutAlt} content={'Sign Out'} dropdown={true}/>
                                        </a></li>
                                    </ul>
                                </div>
                                :
                                <>
                                    <UserButton onClick={() => router.push('/user/login')} icon={faUser}
                                                content={<Link href="/user/login">Sign In</Link>}/>
                                    <UserButton onClick={() => router.push('/user/register')} icon={faUserPlus}
                                                content={<Link href="/user/register">Register</Link>}/>
                                </>}
                        </>}
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="flex items-stretch invisible md:visible">
                        {props.data && props.data.my_podboxx &&
                        <ul
                            className="flex items-center text-center justify-center lg:container px-5 my-auto text-md md:px-6 flex-nowrap select-none">
                            <li>
                                <Socials href={props.data.my_podboxx?.fb_url} icon={faFacebookF}/>
                                <Socials href={props.data.my_podboxx?.twitter_url} icon={faTwitter}/>
                                <Socials href={props.data.my_podboxx?.youtube_url} icon={faYoutube}/>
                                <Socials href={props.data.my_podboxx?.google_url} icon={faGoogle}/>
                                <Socials href={props.data.my_podboxx?.apple_url} icon={faItunes}/>
                                <Socials href={props.data.my_podboxx?.spotify_url} icon={faSpotify}/>
                                <Socials href={props.data.my_podboxx?.linkedin_url} icon={faLinkedin}/>
                            </li>
                        </ul>}
                        {typeof window !== undefined && props.data.channels && Object.keys(props.data.channels).length > 1 &&
                        props.data.channels.some(subscription_required) &&
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap">
                                <span><FontAwesomeIcon icon={faPodcast} className='mr-2' size='lg'/>Podcast</span>
                            </div>
                            <ul className="shadow menu dropdown-content bg-24dp rounded-box w-64">
                                {Object.keys(props.data.channels).map((value, index) =>
                                    <li key={index}>
                                        <a className={currentChannel?.toString() === props.data.channels[index]['id'].toString() ? 'bg-08dp cursor-default btn-disabled' : ""}>
                                            {/*  <a className={index % 2 == 0 ? "" : "bg-12dp"}>*/}
                                            <UserButton
                                                onClick={() => currentChannel?.toString() !== props.data.channels[index]['id'].toString() && handleChannelChange(props.data.channels[index]['id'])}
                                                icon={props.data.channels[index]['subscription_required'] ? faGem : undefined}
                                                currentChannel={currentChannel?.toString() === props.data.channels[index]['id'].toString()}
                                                content={props.data.channels[index]['title']} dropdown={true}/>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                        }
                    </div>
                    <div className="flex-none visible md:invisible">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-square btn-ghost">
                                <FontAwesomeIcon icon={faBars} size='lg'/>
                            </div>
                            <ul className="shadow menu dropdown-content bg-24dp rounded-box w-52 text-center">
                                {isLogged ?
                                    <li>
                                        <a className='my-0 py-0'>
                                            <UserButton onClick={() => router.push('/user/subscriptions')}
                                                        content={'Subscriptions'} dropdown={true}/>
                                        </a>
                                        <a className='my-0 py-0'>
                                            <UserButton onClick={() => signOut(userState.channel, userDispatch)}
                                                        content={'Sign Out'} dropdown={true}/>
                                        </a>
                                    </li> :
                                    <li>
                                        <a className='my-0 py-0'>
                                            <UserButton onClick={() => router.push('/user/login')}
                                                        content={"Sign In"} dropdown={true}/>
                                        </a>
                                        <a className='my-0 py-0'>
                                            <UserButton onClick={() => router.push('/user/register')}
                                                        content={'Register'} dropdown={true}/>
                                        </a>
                                    </li>}
                                {props.data && props.data.my_podboxx &&
                                <li className='text-center'>
                                    <hr className='border-t-2 my-2'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.fb_url} text='Facebook'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.twitter_url} text='Twitter'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.youtube_url} text='Youtube'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.google_url} text='Google'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.apple_url} text='Itunes'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.spotify_url} text='Spotify'/>
                                    <Socials mobile={true} href={props.data.my_podboxx?.linkedin_url} text='Linkedin'/>
                                </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}