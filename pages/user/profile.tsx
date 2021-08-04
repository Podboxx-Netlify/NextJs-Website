import React, {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import useTimeoutFn from "../../libs/useTimeoutFn";
import {Props, UserContext} from "../../components/userContext/user-context";
import useSWR from "swr";
import fetcher from "../../libs/fetcher";
import {UserProfile} from "./subscriptions";
import EditProfile from "../../components/userForms/edit-profile";
import Link from "next/link";
import clsx from "clsx";

const Profile: React.FC = () => {
    const router = useRouter()
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [isReady, cancel, reset] = useTimeoutFn(() => router.push('/user/login'), 5000);
    const {data} = useSWR<UserProfile>(userState.isLogged ? `${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/profile` : null, fetcher, {
        onErrorRetry: (error) => {
            if (error.message.includes('not authorized')) return
        }
    })

    useEffect(() => {
        if (userState.isLogged === true) cancel()
    }, [userState.isLogged])

    function statusColor() {
        let status = data?.subscription?.status
        if (status.includes('Active')) return 'text-success'
        if (status.includes('Canceled')) return 'text-error'
        return 'text-warning'
    }

    if (!userState.isLogged || !data) return <div className="cover-spin" id='cover-spin'/>
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body mb-10">
                    <span className="text-center text-3xl font-bold card-title mb-7">My Profile</span>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:mx-10">
                        <div className="card shadow-lg lg:card-side bg-16dp text-primary-content">
                            <div className="card-body">
                                <EditProfile data={data}/>
                            </div>
                        </div>
                        <div className="card shadow-lg lg:card-side bg-16dp text-primary-content lg:ml-5 mt-5 lg:mt-0">
                            <div className="card-body">
                                <p className="text-xl">Subscription Information</p>
                                {data?.subscription &&
                                <div className='rounded-box py-2 form-control'>
                                    <div className='text-lg'>
                                        <span>Current plan: </span>
                                        <span
                                    className="capitalize text-info">{data?.subscription?.subscription_plan?.name}</span>
                                        <br/>
                                        <span>Current plan status: </span>
                                        <span
                                    className={clsx("capitalize", statusColor())}>{data?.subscription?.status}</span>
                                        <br/>
                                        <span>Current plan end date: </span>
                                        <span className="capitalize text-info">{data?.subscription?.ends_at}</span>
                                    </div>
                                    <button
                                        className="btn btn-outline btn-primary rounded-btn btn-sm whitespace-nowrap mt-3 float-right">
                                        <Link href="/user/subscriptions">Manage</Link>
                                    </button>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile