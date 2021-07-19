// import React, {useState} from 'react'
// import {GetServerSideProps} from 'next'
// import PostCard from "../components/post-card";
// import {useRouter} from "next/router";
//
// interface Data {
//     website?: [title: string]
//     podcasts?: Episodes[]
//     name: string
//     pages: number
// }
//
// interface Episodes {
//     id: number,
//     title: string,
//     description: string,
//     image_url: string,
//     publication_date: string,
//     blog_content?: string,
//     duration?: string,
//     tags?: Array<{ name: string }>
// }
//
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_STATION_ID}/tags_blog?channel=null&tags=${context.query.tags}`)
//     if (res.status !== 200) {
//         const data = {}
//         return {
//             props: {
//                 data,
//             },
//         }
//     } else {
//         const data: Data = await res.json()
//         return {
//             props: {
//                 data,
//             },
//         }
//     }
// }
//
// const Tags: React.FC<{ data: Data }> = ({data}) => {
//     const router = useRouter()
//     const [tagFilter, setTagFilter] = useState([])
//     const handleTagFilter = (tag: string) => {
//         tagFilter.indexOf(tag) === -1 ? tagFilter.push(tag):setTagFilter(tagFilter.filter(i => i !== tag))
//         handleFilter()
//     }
//     // console.log(tagFilter)
//     const handleFilter = () => {
//         console.log('handle Filter ====')
//         let tags = encodeURIComponent(tagFilter.join(","))
//         console.log(tagFilter.length)
//         tagFilter.length > 0 ? router.replace(`/search?tags=${tags}`) : router.replace('/')
//     }
//
//     const handleAddTag = (tag: string) => {
//         console.log(tagFilter, tagFilter.indexOf(tag))
//         tagFilter.indexOf(tag) === -1 && tagFilter.push(tag)
//     }
//     const handleRemoveTag = (tag: string) => {
//         setTagFilter(tagFilter.filter(i => i !== tag))
//     }
//
//     return (
//         <>
//             {data.podcasts && Object.keys(data.podcasts).length > 0 ?
//                 <div className="grid grid-cols-1 gap-5 justify-items-center justify-center">
//                     {Object.keys(data.podcasts).map((value, index) =>
//                         <div key={index} className='w-full'>
//                             <PostCard data={{
//                                 id: data.podcasts[index]['id'],
//                                 title: data.podcasts[index]['title'],
//                                 description: data.podcasts[index]['description'],
//                                 blog_content: data.podcasts[index]['blogContent'],
//                                 img_url: data.podcasts[index]['image_url'] || '/header_card.png',
//                                 publication_date: data.podcasts[index]['publication_date'],
//                                 duration: data.podcasts[index]['duration'],
//                                 tags: data.podcasts[index]['tags'],
//                                 currentFilter: tagFilter,
//                                 addFilter: handleAddTag,
//                                 removeFilter: handleRemoveTag,
//                                 handleTagFilter: handleTagFilter
//                             }}/>
//                         </div>
//                     )}
//                 </div> :
//                 <h1 className='text-main-dark dark:text-white text-5xl text-center justify-self-center select-none'>No
//                     episodes to display</h1>}
//         </>
//     )
// }
//
// export default Tags

export default function UselessFnc(){
    return <></>
}