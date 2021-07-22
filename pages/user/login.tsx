import React, {useContext, useState} from "react";
import JtockAuth from "j-tockauth";
import {useRouter} from "next/router";
import {Props, UserContext} from "../../components/userContext/user-context";

const Login: React.FC = () => {
    const router = useRouter()

    const {userState, userDispatch} = useContext<Props>(UserContext)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        console.log(e.target.value)
        setFormData(data => ({...data, [e.target.id]: e.target.value}))
    }

    const handleSubmit = (e) => {
        console.log('handleSubmit')
        e.preventDefault();
        const auth = new JtockAuth({
            host: "http://127.0.0.1:4000",
            prefixUrl: `/api/${process.env.NEXT_PUBLIC_STATION_ID}/subscribers`,
            debug: true
        });
        userDispatch({type: 'LOADING'})
        auth
            .signIn(formData.email, formData.password)
            .then(userData => {
                userDispatch({type: 'SIGN_IN', user: userData.data})
                router.push('/')
            })
            .catch(error => {
                userDispatch({type: 'ERROR'})
                console.log(error);
            });
    }

    return (
        <div className="w-full grid place-items-center mt-10">
            <div className="p-2 card bg-12dp shadow-md">
                <div className="form-control card-body">
                    <div className="text-center text-3xl font-bold card-title">Sign In</div>
                    <form name="login_form" id="login_form" onSubmit={handleSubmit} action=''>
                        <label className="label"><span className="label-text">Email</span></label>
                        <input className="input input-bordered w-full" type="text"
                               name="email" id="email" value={formData.email} onChange={handleChange}
                               placeholder="Enter Your Email"/>
                        <label className="label"> <span className="label-text">Password</span> </label>
                        <input className="input input-bordered w-full" type="password"
                               name="password" id="password" value={formData.password} onChange={handleChange}
                               placeholder="Enter A Password"/>
                        <a href="#" className="label-text-alt">Forgot username?</a>
                        <div className="form-control justify-center mt-5">
                            <button
                                className="btn btn-outline">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login