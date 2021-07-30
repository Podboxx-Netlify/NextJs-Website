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
import {faGem, faUserCircle} from '@fortawesome/free-regular-svg-icons'
import {useRouter} from "next/router";
import {Props, UserContext} from "../userContext/user-context";
import {signOut} from "../userContext/sign_out";

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
        <header className="sticky z-10 top-0">
            <div className="navbar shadow-lg bg-16dp text-neutral-content h-24 ">
                <div className="px-2 mx-2 navbar-start">
                    <span className="text-lg font-bold select-none"><Link
                        href='/'>{props.data?.title || 'Loading...'}</Link></span>
                </div>
                <div className="navbar-center hidden px-2 mx-2 lg:flex">
                    <div className="flex items-stretch">
                        <a className="btn btn-ghost btn-sm rounded-btn" onClick={() => router.replace('/')}>
                            Home
                        </a>
                        {isLogged ?
                            <div className="dropdown dropdown-end invisible md:visible">
                                <div tabIndex={0} className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap">
                                    <FontAwesomeIcon icon={faUserCircle} className='mr-2' size='lg'/>My Account
                                </div>
                                <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-52">
                                    <li>
                                        <a>
                                            <button className="focus:outline-none w-full font-medium whitespace-nowrap"
                                                    onClick={() => router.push('/user/subscriptions')}>
                                                Subscriptions
                                            </button>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <button className="focus:outline-none w-full font-medium whitespace-nowrap"
                                                    onClick={() => signOut(userState.channel, userDispatch)}>
                                                Sign Out
                                            </button>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            :
                            <div className="invisible md:visible">
                                <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                        onClick={() => router.push('/user/login')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                         width="24px"
                                         fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current"
                                         strokeWidth="2">
                                        <path
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <Link href="/user/login">Sign In</Link>
                                </button>
                                <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                        onClick={() => router.push('/user/register')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                                         width="24px"
                                         fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current"
                                         strokeWidth="2">
                                        <path
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <Link href="/user/register">Register</Link>
                                </button>
                            </div>}
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="flex items-stretch invisible md:visible">
                        {props.data && props.data.my_podboxx &&
                        <ul
                            className="flex items-center text-center justify-center lg:container px-5 my-auto text-md md:px-6 flex-wrap select-none">
                            <li>
                                {props.data.my_podboxx?.fb_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.fb_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faFacebookF} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.twitter_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.twitter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faTwitter} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.youtube_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faYoutube} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.google_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.google_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faGoogle} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.apple_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.apple_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faItunes} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.spotify_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.spotify_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faSpotify} size='lg'/>
                                </a>
                                }
                                {props.data.my_podboxx?.linkedin_url !== null &&
                                <a
                                    href={props.data.my_podboxx?.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500 mx-2"
                                >
                                    <FontAwesomeIcon icon={faLinkedin} size='lg'/>
                                </a>
                                }
                            </li>
                        </ul>}
                        {typeof window !== undefined && props.data.channels && Object.keys(props.data.channels).length > 1 &&
                        props.data.channels.some(subscription_required) &&
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0}
                                 className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap">Select Podcast
                            </div>
                            <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-64">
                                {Object.keys(props.data.channels).map((value, index) =>
                                    props.data.channels[index]['subscription_required'] ?
                                        <li key={index}>
                                            <a>
                                                <button
                                                    className={currentChannel?.toString() === props.data.channels[index]['id'].toString() ? "focus:outline-none w-full text-green-500" : "focus:outline-none w-full"}
                                                    onClick={() => currentChannel?.toString() !== props.data.channels[index]['id'].toString() && handleChannelChange(props.data.channels[index]['id'], true)}>
                                                            <span
                                                                className="line-clamp-1 font-semibold capitalize">
                                                                <FontAwesomeIcon icon={faGem} size='sm'/> &nbsp;
                                                                {props.data.channels[index]['title']}</span>
                                                </button>
                                            </a>
                                        </li> :
                                        <li key={index}>
                                            <a>
                                                <button
                                                    className={currentChannel?.toString() === props.data.channels[index]['id'].toString() ? "focus:outline-none w-full text-green-500" : "focus:outline-none w-full"}
                                                    onClick={() => currentChannel?.toString() !== props.data.channels[index]['id'].toString() && handleChannelChange(props.data.channels[index]['id'])}>
                                                            <span
                                                                className="line-clamp-1 capitalize">{props.data.channels[index]['title']}</span>
                                                </button>
                                            </a>
                                        </li>
                                )}
                            </ul>
                        </div>
                        }
                    </div>
                </div>
                <div className="flex-none md:invisible">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                            </svg>
                        </div>
                        <ul className="shadow menu dropdown-content bg-24dp rounded-box w-52">
                            {isLogged ?
                                <li>
                                    <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                            onClick={() => router.push('/user/subscriptions')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                             viewBox="0 0 24 24"
                                             width="24px" fill="#FFFFFF" strokeWidth="2"
                                             className="inline-block w-5 mr-2 stroke-current">
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        Subscriptions
                                    </button>
                                    <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                            onClick={() => signOut(userState.channel, userDispatch)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                             viewBox="0 0 24 24"
                                             width="24px" fill="#FFFFFF" strokeWidth="2"
                                             className="inline-block w-5 mr-2 stroke-current">
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        Sign Out
                                    </button>
                                </li> :
                                <li>
                                    <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                            onClick={() => router.push('/user/login')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                             viewBox="0 0 24 24"
                                             width="24px"
                                             fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current"
                                             strokeWidth="2">
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        <Link href="/user/login">Sign In</Link>
                                    </button>
                                    <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap"
                                            onClick={() => router.push('/user/register')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                                             viewBox="0 0 24 24"
                                             width="24px"
                                             fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current"
                                             strokeWidth="2">
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        <Link href="/user/register">Register</Link>
                                    </button>
                                </li>}
                            {props.data.my_podboxx?.fb_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.fb_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Facebook</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.twitter_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.twitter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Twitter</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.youtube_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.youtube_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Youtube</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.google_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.google_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Google</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.apple_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.apple_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Itunes</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.spotify_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.spotify_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">Spotify</p>
                                </a>
                            </li>
                            }
                            {props.data.my_podboxx?.linkedin_url !== null &&
                            <li>
                                <a
                                    href={props.data.my_podboxx?.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold hover:text-red-500"
                                >
                                    <p className="text-lg">LinkedIn</p>
                                </a>
                            </li>
                            }
                        </ul>
                    </div>
                </div>
                {/*<DarkMode/>*/}
                {/*</div>*/}
            </div>
        </header>
    );
}