import React from "react";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faClock} from "@fortawesome/free-regular-svg-icons";
import useSWR from "swr";
import fetcher from "../../libs/fetcher"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
    const {data, error} = useSWR<Data>(baseUri + /podcast/ + router.query.id, fetcher)


    if (error) return <div>failed to load</div>
    // eslint-disable-next-line @next/next/no-img-element
    if (!data) return <img className='mx-auto my-auto object-center justify-items-center align-middle'
                           src='../loading.svg' alt='loading'/>

    return (
        <div
            className="w-full md:rounded-md shadow-lg flex flex-col select-none gap-4 mt-12 bg-12dp">
            <button
                className="text-left p-5 w-28 font-bold text-lg hover:text-red-500 focus:outline-none"
                onClick={() => {
                    router.query.id !== 'preview' &&
                    router.back()
                }}>Go Back
            </button>

            <article className="prose prose-sm lg:prose-lg mx-auto max-w-screen-lg px-5">
                <h1 className='text-center capitalize col-span-2'>{data.title || 'Error loading the episode'}</h1>
                <h4 className="text-sm text-center" style={{marginTop: '-20px'}}>
                    <FontAwesomeIcon className="mr-1"
                                     icon={faCalendarAlt}/> {dayjs(data.publication_date).utc().format('MMMM D YYYY')}
                    {data.duration && <>
                        <FontAwesomeIcon icon={faClock} className="ml-4 mr-1"/> {data.duration}
                    </>}
                </h4>
                {data.blog_content !== null &&
                <div className="max-w-none"
                     dangerouslySetInnerHTML={{__html: data.blog_content}}/>
                }
            </article>
            <br/>
            {data.title && router.query.id &&
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
