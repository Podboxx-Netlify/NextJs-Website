import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import useTimeoutFn from "../../libs/useTimeoutFn";
import {Props, UserContext} from "../../components/userContext/user-context";
import useSWR from "swr";
import fetcher from "../../libs/fetcher";
import {UserProfile} from "./subscriptions";
import EditProfile from "../../components/userForms/edit-profile";
import EditPassword from "../../components/userForms/edit-password";

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

    console.log(data)
    // if (!userState.isLogged || !data) return <div className="cover-spin" id='cover-spin'/>
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body">
                    <span className="text-center text-3xl font-bold card-title">My Profile</span>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content">
                            <div className="card-body">
                                <EditProfile data={data}/>
                                <div className="collapse rounded-box collapse-arrow mt-5 min-h-96">
                                    <input type="checkbox"/>
                                    <div className="collapse-title text-xl font-medium">
                                        Edit Password
                                    </div>
                                    <EditPassword/>
                                </div>
                            </div>
                        </div>
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content ml-5">
                            <div className="card-body">
                                <p className="text-xl">Payment Method</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile