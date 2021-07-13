import React, {useState} from "react";
import Auth from "j-toker";

const Login: React.FC = () => {
    Auth.configure({apiUrl: 'http://localhost:4000/api/29/subscribers'});
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

        Auth.emailSignIn({
            email: formData.email,
            password: formData.password
        })
            .then(res => {console.log(res)} )
    }

    return (
        <div className="w-full grid place-items-center mt-5">
            <div className="p-2 card bg-base-200 red-shadow" style={{backgroundColor: '#292d35'}}>
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