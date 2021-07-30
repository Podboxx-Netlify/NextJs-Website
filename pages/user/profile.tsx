import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import useTimeoutFn from "../../libs/useTimeoutFn";
import {Props, UserContext} from "../../components/userContext/user-context";
import useSWR from "swr";
import fetcher from "../../libs/fetcher";
import {UserProfile} from "./subscriptions";
import validator from 'validator';
import JtockAuth from "j-tockauth";
import {ErrorNotification, SuccessNotification} from "../../components/notification";

const Profile: React.FC = () => {
    const router = useRouter()
    const [error, setError] = useState<string[]>([])
    const [passwordScore, setPasswordScore] = useState<number>(0)
    const [passwordColor, setPasswordColor] = useState<string>("progress progress-error")
    const [formData, setFormData] = useState({
        new_password: '',
        current_password: '',
        password_confirmation: ''
    })
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

    const handleChange = (id: string, value: string) => {
        setFormData(data => ({...data, [id]: value}))
    }

    const updatePassword = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (verifyPassword()) return
        const auth = new JtockAuth({
            host: process.env.NEXT_PUBLIC_API_URL,
            prefixUrl: `${userState.channel}/subscribers`,
            debug: true
        });
        userDispatch({type: 'LOADING'})
        auth
            .changePassword(
                formData.current_password,
                formData.new_password,
                formData.password_confirmation,
            )
            .then(() => {
                SuccessNotification(userDispatch, 'Password successfully changed', 'password')
                // router.push('/user/login')
            })
            .catch(e => {
                ErrorNotification(userDispatch, 'There was an error when editing your password.', 'password')
                error.push('There was an error when editing your password.')
            });
    }

    const onPasswordChange = (id: string, value: string) => {
        handleChange(id, value)
        setPasswordScore(validator.isStrongPassword(value, {
            returnScore: true,
            pointsForContainingLower: 6,
            pointsForContainingUpper: 6,
            pointsForContainingNumber: 6,
            pointsForContainingSymbol: 6
        }))
        switch (true) {
            case (passwordScore > 0 && passwordScore < 15):
                setPasswordColor("progress progress-error");
                break;
            case (passwordScore >= 15 && passwordScore < 25):
                setPasswordColor("progress progress-warning");
                break;
            case (passwordScore >= 25):
                setPasswordColor("progress progress-success");
                break;
            default:
                setPasswordColor("progress progress-error");
                break;
        }
    }

    const verifyPassword = () => {
        let errors = []
        !validator.isStrongPassword(formData.new_password, {minSymbols: 0}) && errors.push('Password needs atleast 8 characters, 1 number, 1 lowercase and 1 uppercase.')
        formData.new_password !== formData.password_confirmation && errors.push('Your password confirmation does not match.')
        validator.isEmpty(formData.current_password) && errors.push('Your current password cannot be blank.')
        setError(errors)
        return errors.length > 0;
    }


    // if (!userState.isLogged || !data) return <div className="cover-spin" id='cover-spin'/>
    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-08dp shadow-md">
                <div className="form-control card-body">
                    <span className="text-center text-3xl font-bold card-title">My Profile</span>
                    <div className="grid grid-cols-2 mx-10">
                        <div className="card shadow-2xl lg:card-side bg-12dp text-primary-content">
                            <div className="card-body">
                                {/*<p className="text-xl">Payment Method</p>*/}
                                <div className="collapse w-96 rounded-box  collapse-arrow mt-5">
                                    <input type="checkbox"/>
                                    <div className="collapse-title text-xl font-medium">
                                        Edit Password
                                    </div>
                                    <div className="collapse-content">
                                        {error.length > 0 &&
                                        error.map((e => <span key={e} className='w-full text-error'>{e}</span>
                                        ))}
                                        <form name="edit_password_form" id="edit_password_form"
                                              onSubmit={updatePassword} action='#'>
                                            <label className="label"> <span
                                                className="label-text">Current Password</span> </label>
                                            <input className="input input-bordered w-full" type="password"
                                                   name="current-password" id="current-password"
                                                   autoComplete="current-password"
                                                   value={formData.current_password || ''}
                                                   placeholder="Enter your current password"
                                                   onChange={e => handleChange('current_password', e.target.value)}/>
                                            <label className="label"> <span className="label-text">New Password</span>
                                            </label>
                                            <input className="input input-bordered w-full" type="password"
                                                   onChange={e => onPasswordChange('new_password', e.target.value)}
                                                   autoComplete='new-password'
                                                   name="new-password" id="new-password"
                                                   value={formData.new_password || ''}
                                                   placeholder="Enter a new password"/>
                                            <progress className={passwordColor} value={passwordScore} max={50}/>
                                            <label className="label"> <span
                                                className="label-text">Password Confirmation</span> </label>
                                            <input className="input input-bordered w-full" type="password"
                                                   onChange={e => handleChange('password_confirmation', e.target.value)}
                                                   name="password-confirmation" id="password-confirmation" autoComplete="off"
                                                   value={formData.password_confirmation || ''}
                                                   placeholder="Re-enter your new password"/>
                                            <div className="form-control justify-center mt-5">
                                                <button type="submit"
                                                    className={userState.isLoading ? "btn btn-outline loading" : "btn btn-outline"}>
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
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