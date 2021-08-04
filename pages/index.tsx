import React, {useContext, useEffect, useState} from 'react'
import PostCard from "../components/post-card";
import ReactPaginate from 'react-paginate';
import {useRouter} from "next/router";
import {Props, UserContext} from "../components/userContext/user-context";
import useSWR from "swr";
import fetcher from "../libs/fetcher"

interface Data {
    website?: [title: string]
    podcasts?: Episodes[]
    name: string
    pages: number
}

interface Episodes {
    id: number,
    title: string,
    description: string,
    image_url: string,
    publication_date: string,
    blog_content?: string,
    duration?: string,
    tags?: Array<{ name: string }>
}

const Blog: React.FC = () => {
    const router = useRouter()
    const {userState} = useContext<Props>(UserContext)
    const [uri, setUri] = useState<string>()
    const [tagFilter, setTagFilter] = useState<string[]>([])
    const [shouldFetch, setShouldFetch] = useState<boolean>(false)
    const [pageIndex, setPageIndex] = useState(parseInt(router.query.page as string) || 1);
    const baseUri = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/`
    const {data, error} = useSWR<Data>(shouldFetch ? uri + '&page=' + pageIndex : null, fetcher, {
        onErrorRetry: (error) => {
            // Do not retry if message includes not authorized
            if (error.message.includes('not authorized')) return
        }
    })

    useEffect(() => {
        // Creates the tag query
        let tags = tagFilter.length > 0 ? `&tags=${encodeURIComponent(tagFilter.join(","))}` : ''
        // Creates the Channel query
        let channel = `channel=${userState.channel || null}`
        // Changes the endpoints depending if theres any tag filter
        let endpoint = tagFilter.length > 0 ? 'tags_blog?' : 'blog?'
        // Create the uri with all the queries
        setUri(baseUri + endpoint + channel + tags)
        // Set the shouldFetch to true if it wasn't true already
        !shouldFetch && setShouldFetch(true)
    }, [userState.channel, tagFilter, baseUri, shouldFetch])

    useEffect(() => {
        // If no tags in query => reset tagFilter array
        router.query.tags === undefined && setTagFilter([])
    }, [router.query.tags])

    const handleAddTag = (tag: string) => {
        return setTagFilter([...tagFilter, tag])
    }
    const handleRemoveTag = (tag: string) => {
        return setTagFilter(tagFilter.filter(i => i !== tag))
    }

    if (error && error.message.includes('not authorized')) return (
        <>
            <div className='text-2xl text-semibold mx-auto mt-10'>You are not authorized to view the episodes of this
                podcast.
            </div>
            <button className='btn btn-primary mt-4'
                    onClick={() => router.push(userState.isLogged ? '/user/dashboard' : '/user/login')}>Click here
                to {userState.isLogged ? 'subscribe' : 'sign in'}</button>
        </>
    )
    if (error) return <div className='text-2xl text-semibold mx-auto mt-10'>There was an error loading the
        episodes.</div>
    if (!data) return <div className="cover-spin" id='cover-spin'/>
    if (Object.keys(data?.podcasts).length <= 0) return <div className='text-2xl text-semibold mx-auto mt-10 ml-5'>No
        episodes to display for this podcast.</div>
    return (
        <>
            <div className="grid grid-cols-1 gap-5 justify-items-center justify-center mt-12">
                {/* Blog Posts */}
                {Object.keys(data.podcasts).map((value, index) =>
                    <div key={index} className='w-full'>
                        <PostCard data={{
                            id: data.podcasts[index]['id'],
                            title: data.podcasts[index]['title'],
                            description: data.podcasts[index]['description'],
                            blog_content: data.podcasts[index]['blogContent'],
                            img_url: data.podcasts[index]['image_url'] || '/header_card.png',
                            publication_date: data.podcasts[index]['publication_date'],
                            duration: data.podcasts[index]['duration'],
                            tags: data.podcasts[index]['tags'],
                            currentFilter: tagFilter,
                            addFilter: handleAddTag,
                            removeFilter: handleRemoveTag,
                        }}/>
                    </div>
                )}
            </div>
            {/* Bottom Pagination */}
            {data?.pages > 0 &&
            <div className="py-2">
                <ReactPaginate
                    pageCount={data?.pages + 1}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={(i) => setPageIndex(i.selected + 1)}
                    containerClassName={'flex mx-auto mt-10 justify-center'}
                    activePageClassName={'text-red-900'}
                    nextLabel='navigate_next'
                    previousLabel='navigate_before'
                    activeLinkClassName={'text-bold text-2xl text-red-500'}
                    previousClassName={'dark:text-white material-icons-outlined pt-0.5 hover:text-red-500'}
                    nextClassName={'dark:text-white cursor-pointer select-none material-icons-outlined pt-0.5 hover:text-red-500'}
                    pageClassName={'dark:text-white cursor-pointer select-none text-lg sm:px-3 mx-2 hover:text-red-500'}
                    breakLinkClassName={'dark:text-white text-lg sm:px-3 mx-2 hover:text-red-500'}
                    disabledClassName={'material-icons-outlined'}
                    forcePage={pageIndex - 1 || 0}
                />
            </div>}
        </>
    )
}

export default Blog