import React, {useContext, useState} from "react";
import JtockAuth from "j-tockauth";
import {Props, UserContext} from "../../components/userContext/user-context";
import validator from 'validator';

interface Errors {
    email?: string[]
}

const Register: React.FC = () => {
    const [error, setError] = useState<string[]>([])
    const [passwordScore, setPasswordScore] = useState<number>(0)
    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const handleChange = (e) => {
        console.log(e.target.value)
        setFormData(data => ({...data, [e.target.id]: e.target.value}))
    }

    // const handleErrors = (key: string, value: string) => {
    //     setError({
    //         ...error,
    //         [key]: value
    //     })
    // }

    const verifyData = () => {
        !validator.isEmail(formData.email) && error.push('Email is invalid.')
        !validator
        console.log(validator.isEmail(formData.email))
    }

    const onPasswordChange = (e) => {
        handleChange(e)
        setPasswordScore(validator.isStrongPassword(e.target.value,{returnScore: true}))
        console.log(passwordScore)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        verifyData()
        const auth = new JtockAuth({
            host: process.env.NEXT_PUBLIC_API_URL,
            prefixUrl: `${userState.channel}/subscribers`,
            debug: true
        });
        userDispatch({type: 'LOADING'})
        auth
            .signUp(
                {
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                },
                "http://localhost:5000/user/login"
            )
            .then(userDatas => {
                console.log(userDatas);
            })
            .catch(error => {
                userDispatch({type: 'ERROR'})
                // setError('There was an error when creating your account.')
                console.log(error);
            });
    }

    return (
        <div className="grid place-items-center mb-10 mt-10 ">
            <div className="card bg-12dp shadow-md lg:w-4/12">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Register</div>
                    <form name="registration_form" id="registration_form" onSubmit={handleSubmit} action=''>
                        <label className="label"><span className="label-text">First Name</span></label>
                        <input className="input input-bordered w-full" type="text"
                               name="first_name" id="first_name" value={formData.first_name}
                               onChange={handleChange}
                               placeholder="Enter Your First Name"/>
                        <label className="label"><span className="label-text">Last Name</span></label>
                        <input className="input input-bordered w-full" type="text"
                               name="last_name" id="last_name" value={formData.last_name}
                               onChange={handleChange}
                               placeholder="Enter Your Last Name"/>
                        <label className="label"><span className="label-text">Email</span></label>
                        <input className="input input-bordered w-full" type="email"
                               name="email" id="email" value={formData.email} onChange={handleChange}
                               placeholder="Enter Your Email"/>
                        <label className="label"><span className="label-text">Password</span></label>
                        <input className="input input-bordered w-full" type="password"
                               name="password" id="password" value={formData.password} onChange={onPasswordChange}
                               placeholder="Enter A Password"/>
                        <progress className={passwordScore > 30 ? "progress progress-success":"progress progress-error"} value={passwordScore} max={60}/>
                        <label className="label"><span className="label-text">Confirm Password</span></label>
                        <input className="input input-bordered w-full" type="password"
                               name="password_confirmation" id="password_confirmation"
                               value={formData.password_confirmation} onChange={handleChange}
                               placeholder="Re-Enter Your Password"/>
                        <div className="form-control justify-center mt-5">
                            {/*<div className='text-error'>{error !== '' && error}</div>*/}
                            <button
                                className={userState.isLoading ? "btn btn-outline loading" : "btn btn-outline"}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register