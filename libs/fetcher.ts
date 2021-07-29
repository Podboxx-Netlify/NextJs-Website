// import fetch from 'isomorphic-unfetch'
import {toast} from "react-toastify";

interface ResError extends Error {
    info?: Response
    status?: number
}

export default async function fetcher<JSON = any>(
    input: RequestInfo,
    // init?: RequestInit
): Promise<JSON> {
    const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))

    const res = await fetch(input, {
        headers: {
            uid: headers['uid'] || null,
            client: headers['client'] || null,
            "access-token": headers["access-token"] || null,
            channel: JSON.parse(localStorage.getItem('channel')) || null
        }
    })

    if (res.status === 403) {
        toast.error('You are not authorized to access this resource.', {
            toastId: 'ErrorNotification',
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    //     // Attach extra info to the error object.
    //     // error.info = await res.json()
    //     // error.status = res.status
    //     // let error = new Error('You are not authorized to access this resource.');
    //     // error = {status: res.status, info: await res.json()}
    //     // error['status'] = res.status;
    //     // error['info'] = await res.json()
        throw new Error('You are not authorized to access this resource.');
    //
    //     let error = {status: res.status, info: await res.json()}
    //     throw error
    }

    return res.json()
}