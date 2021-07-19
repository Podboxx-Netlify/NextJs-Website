import React, {useEffect, useState} from "react";
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
import {useRouter} from "next/router";

export default function Header({...props}) {
    const [heroImage, setHeroImage] = useState(false)
    const router = useRouter()

    useEffect(() => {
        router.pathname === "/" && setHeroImage(true)
    }, [])

    return (
        <>
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
                    </div>
                </div>
            </header>

        </>
    );
}