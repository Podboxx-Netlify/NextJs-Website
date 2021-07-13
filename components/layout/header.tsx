import React, {useEffect} from "react";
import Link from 'next/link'
import DarkMode from "../dark-mode";
import {useRouter} from "next/router";
import Auth from "j-toker";

export default function Header({...props}) {
    const router = useRouter()
    // Auth.configure({apiUrl: 'http://localhost:4000/api/29/subscribers'});
    // useEffect(() =>
    // {
    //     Auth.validateToken()
    //         .then(function (user) {
    //             console.log(user)
    //             if (user.id) {
    //                 this.loggedIn = user;
    //             } else {
    //                 this.loggedIn = false;
    //             }
    //
    //         });
    //         },[])

    const handleChannelChange = (id: string | number) => {
        localStorage.channel = id
        router.replace({
            pathname: '/',
            query: {channel_id: id},
        }, '/')
    }

    return (
        <header className="mb-12 sticky z-10 top-0">
            <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content ">
                <div className="px-2 mx-2 navbar-start">
                    <span className="text-lg font-bold select-none"><Link
                        href='/'>{props.data?.title || 'Loading...'}</Link></span>
                </div>
                <div className="navbar-center hidden px-2 mx-2 lg:flex">
                    <div className="flex items-stretch">
                        {props.data && props.data.my_podboxx &&
                        <ul
                            className="flex items-center text-center justify-center lg:container px-5 my-auto text-md md:px-6 flex-wrap select-none">
                            <li>
                                {props.data.my_podboxx?.fb_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.fb_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Facebook
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.twitter_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.twitter_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Twitter
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.youtube_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.youtube_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Youtube
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.google_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.google_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Google
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.apple_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.apple_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Itunes
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.spotify_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.spotify_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Spotify
                                    </a>
                                </>
                                }
                                {props.data.my_podboxx?.linkedin_url !== null &&
                                <>
                                    <a className='select-none first:hidden last:hidden'> | </a>
                                    <a
                                        href={props.data.my_podboxx?.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold hover:text-red-500"
                                    >
                                        Linkedin
                                    </a>
                                </>
                                }
                            </li>
                        </ul>}
                    </div>
                </div>
                <div className="navbar-end">
                    {props.data.channels && Object.keys(props.data.channels).length > 1 &&
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost rounded-btn">Select Podcast</div>
                        <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-64">
                            {Object.keys(props.data.channels).map((value, index) =>
                                <li key={index}>
                                    <a>
                                        <button
                                            className="focus:outline-none w-full"
                                            onClick={() => handleChannelChange(props.data.channels[index]['id'])}><span
                                            className="line-clamp-1">{props.data.channels[index]['title']}</span>
                                        </button>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                    }
                    {/*<Link href="/user/login">*/}
                    {/*    <button className="btn btn-ghost rounded-btn whitespace-nowrap">*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"*/}
                    {/*             fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current" strokeWidth="2">*/}
                    {/*            <path*/}
                    {/*                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>*/}
                    {/*        </svg>*/}
                    {/*        Sign In*/}
                    {/*    </button>*/}
                    {/*</Link>*/}
                    {/*<button className="btn btn-ghost rounded-btn whitespace-nowrap">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"*/}
                    {/*         fill="#FFFFFF" className="inline-block w-5 mr-2 stroke-current" strokeWidth="2">*/}
                    {/*        <path*/}
                    {/*            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>*/}
                    {/*    </svg>*/}
                    {/*    <Link href="/user/register">Register</Link>*/}
                    {/*</button>*/}
                    <DarkMode/>
                </div>
                {/*    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>*/}
            </div>

            {/*<ul className="flex items-end text-right justify-end lg:container select-none mt-3 md:mt-0 ">*/}
            {/*    <DarkMode/>*/}
            {/*    <div className="dropdown dropdown-end ml-2">*/}
            {/*        <div tabIndex={0} className="m-1 btn">Channels</div>*/}
            {/*        <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-44">*/}
            {/*            {Object.keys(props.data.channels).map((value, index) =>*/}
            {/*                <li key={index}>*/}
            {/*                    <a className={(typeof window !== 'undefined' && localStorage.channel == props.data.channels[index]['id']) ? "bg-base-200 btn-disabled" : ""}>*/}
            {/*                        <button*/}
            {/*                            className={(typeof window !== 'undefined' && localStorage.channel) == props.data.channels[index]['id'] ? "focus:outline-none btn-disabled" : "focus:outline-none"}*/}
            {/*                            onClick={() => handleChannelChange(props.data.channels[index]['id'])}><span*/}
            {/*                            className="line-clamp-1">{props.data.channels[index]['title']}</span></button>*/}
            {/*                    </a>*/}
            {/*                </li>*/}
            {/*            )}*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</ul>*/}
        </header>
    );
}