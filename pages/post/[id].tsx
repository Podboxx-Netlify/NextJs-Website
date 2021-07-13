import {GetServerSideProps} from 'next'
import React, {useEffect} from "react";
import {useRouter} from "next/router";

interface Data {
    title: string
    blog_content?: string
    description?: string
    image_url?: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context.query.preview) {
        const data = {title: context.query.title, blog_content: context.query.blog_content}
        return {
            props: {
                data,
            },
        }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/podcast/${context.query.id}`)
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/podcast/${context.query.id}`)
    if (res.status !== 200) {
        const data = {}
        return {
            props: {
                data,
            },
        }
    } else {
        const data: Data = await res.json()
        return {
            props: {
                data,
            },
        }
    }
}

const Post: React.FC<{ data: Data }> = ({data}) => {
    const router = useRouter()
    const playerId = router.query.id == 'preview' ? '38010' : router.query.id
    useEffect(() => {
        // If in preview mode send message when page is loaded
        if (router.query.id == 'preview') {
            router.isReady && console.log('message');
            router.isReady && parent.postMessage('Ready', '*')
        }
    }, [router.isReady, router.query.id])
    return (
        <>
            <div
                className="w-full md:rounded-2xl flex flex-col sm:flex-col select-none gap-4 dark:bg-cards-dark">
                <button
                    className="text-left p-5 w-28 font-bold text-gray-300 text-lg hover:text-red-500 focus:outline-none"
                    onClick={() => {
                        router.query.id !== 'preview' &&
                        router.back()
                    }}>Go Back
                </button>
                <article className="prose prose-sm sm:prose lg:prose-lg mx-auto">
                    <h1 className='text-center capitalize'>{data.title || 'Error loading the episode'}</h1>
                    {data.blog_content !== null &&
                    <div
                        dangerouslySetInnerHTML={{__html: data.blog_content}}/>
                    }
                </article>
                <br/>
            </div>
            <div className="w-max mt-5 " style={{width: '100%'}}>
                {data.title && router.query.id &&
                <iframe className='' width='100%' height='400px'
                        src={"https://player.podboxx.com/" + playerId}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen/>
                }
            </div>
        </>
    )
}


export default Post
