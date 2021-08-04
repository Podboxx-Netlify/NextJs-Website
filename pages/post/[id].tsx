import React, {useContext} from "react";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faClock} from "@fortawesome/free-regular-svg-icons";
import useSWR from "swr";
import fetcher from "../../libs/fetcher"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {Props, UserContext} from "../../components/userContext/user-context";

interface Data {
    title: string
    blog_content?: string
    description?: string
    image_url?: string
    publication_date?: string
    duration?: number
}

const Post: React.FC = () => {
    dayjs.extend(utc)
    const router = useRouter()
    const baseUri = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/`
    const {data, error} = useSWR<Data>(baseUri + 'podcast/' + router?.query?.id, fetcher)
    const {userState} = useContext<Props>(UserContext)

    if (error?.message.includes('not authorized')) return (
        <div className='ml-5'>
            <div className='text-2xl text-semibold mx-auto mt-10'>You are not authorized to view the episodes of this
                podcast.
            </div>
            <button className='btn btn-primary mt-4'
                    onClick={() => router.push(userState.isLogged ? '/user/subscriptions' : '/user/login')}>Click here
                to {userState.isLogged ? 'subscribe' : 'sign in'}</button>
        </div>
    )
    if (error) return <div className='ml-5'>failed to load</div>
    if (!data) return <div className="cover-spin" id='cover-spin'/>

    return (
        <div
            className="w-full md:rounded-md shadow-lg flex flex-col select-none gap-4 mt-12 bg-12dp">
            <button // Go back button
                className="text-left p-5 w-28 font-bold text-lg hover:text-red-500 focus:outline-none"
                onClick={() => {
                    router.query.id !== 'preview' &&
                    router.back()
                }}>Go Back
            </button>
            {/* Post Content */}
            <article className="prose prose-sm lg:prose-lg mx-auto max-w-screen-lg px-5">
                {/* Title */}
                <h1 className='text-center capitalize col-span-2'>{data?.title || 'Error loading the episode'}</h1>
                {/* Date & Duration */}
                <h4 className="text-sm text-center" style={{marginTop: '-20px'}}>
                    <FontAwesomeIcon className="mr-1" icon={faCalendarAlt}/>
                    {dayjs(data?.publication_date).utc().format('MMMM D YYYY')}
                    {data?.duration && <> <FontAwesomeIcon icon={faClock} className="ml-4 mr-1"/> {data?.duration} </>}
                </h4>
                {/* Blog Content */}
                {data?.blog_content &&
                <div className="max-w-none" dangerouslySetInnerHTML={{__html: data.blog_content}}/>}
            </article>

            <br/>
            {/* Player */}
            {data?.title && router.query.id &&
            <div className="min-h-96 h-72 my-20">
                <iframe className='h-80 w-full mb-5'
                        src={`https://player.podboxx.com/${router.query.id}?blog=true`}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; microphone"
                        allowFullScreen/>
            </div>
            }
        </div>
    )
}

export default Post
