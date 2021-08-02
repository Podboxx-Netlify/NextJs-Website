import React, {useContext, useState} from "react";
import {Props, UserContext} from "../userContext/user-context";
import validator from 'validator';
import JtockAuth from "j-tockauth";
import {ErrorNotification, SuccessNotification} from "../../components/notification";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function EditPassword() {
    const [error, setError] = useState<string[]>([])
    const [toggleForm, setToggleForm] = useState<boolean>(false)
    const [passwordScore, setPasswordScore] = useState<number>(0)
    const [passwordColor, setPasswordColor] = useState<string>("progress progress-error")
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [formData, setFormData] = useState({
        new_password: '',
        current_password: '',
        password_confirmation: ''
    })

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
        !validator.isStrongPassword(formData.new_password, {minSymbols: 0}) && errors.push('Password needs at least 8 characters, 1 number, 1 lowercase and 1 uppercase.')
        formData.new_password !== formData.password_confirmation && errors.push('Your password confirmation does not match.')
        validator.isEmpty(formData.current_password) && errors.push('Your current password cannot be blank.')
        setError(errors)
        return errors.length > 0;
    }

    return (
        <div className='collapse-content'>
            {error.length > 0 &&
            <div className='mt-3'>
                {error.map((e => <p key={e} className='w-full text-error'>{e}</p>))}
            </div>}
            <form name="edit_password_form" id="edit_password_form" className='mt-3'
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
                        <FontAwesomeIcon icon={faSave} className='mr-2'/>
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    )
}