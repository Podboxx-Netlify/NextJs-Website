import React, {useEffect, useState} from "react";
import JtockAuth from "j-tockauth";
// import DropIn from "braintree-web-drop-in-react";

// payment_methods/client_token
// <div style={{ textAlign: "center" }}>
//     <DropIn
//         options={{
//             authorization:
//                 "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiI5YTk5OGE1OWUxOWIwMjI5OGViMTlhYWRhMTBmYzQ0ZjM4YmM3ZDkxYWI2NzczZTY2MDg1YTNmOGE5MTE5MjBlfGNyZWF0ZWRfYXQ9MjAxNy0wNS0xNlQxMDoyMDoyMi4wMTU5NTc5NTMrMDAwMFx1MDAyNm1lcmNoYW50X2FjY291bnRfaWQ9NmNzaGhzNXp4dzV0cnB2c1x1MDAyNm1lcmNoYW50X2lkPWN6dGdjcnBiNXN4eGI3ajhcdTAwMjZwdWJsaWNfa2V5PWZ3bWZmOWpzOHR4cnhyNHAiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbImN2diJdLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvY3p0Z2NycGI1c3h4YjdqOC9jbGllbnRfYXBpIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhbmFseXRpY3MiOnsidXJsIjoiaHR0cHM6Ly9jbGllbnQtYW5hbHl0aWNzLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb20vY3p0Z2NycGI1c3h4YjdqOCJ9LCJ0aHJlZURTZWN1cmVFbmFibGVkIjpmYWxzZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiVGFwcG9pbnRtZW50IiwiY2xpZW50SWQiOm51bGwsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImFsbG93SHR0cCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOnRydWUsImVudmlyb25tZW50Ijoib2ZmbGluZSIsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJicmFpbnRyZWVDbGllbnRJZCI6Im1hc3RlcmNsaWVudDMiLCJiaWxsaW5nQWdyZWVtZW50c0VuYWJsZWQiOnRydWUsIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiY3p0Z2NycGI1c3h4YjdqOCIsInZlbm1vIjoib2ZmIiwiYXBwbGVQYXkiOnsic3RhdHVzIjoibW9jayIsImNvdW50cnlDb2RlIjoiVVMiLCJjdXJyZW5jeUNvZGUiOiJVU0QiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udGFwcG9pbnRtZW50Iiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sIm1lcmNoYW50QWNjb3VudElkIjoiNmNzaGhzNXp4dzV0cnB2cyJ9",
//         }}
//     />
//     <button>Buy Now!</button>
// </div>

const Register: React.FC = () => {
    const [error, setError] = useState('')
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

    const handleSubmit = (e) => {
        console.log('handleSubmit')
        e.preventDefault();
        e.stopPropagation();
        const auth = new JtockAuth({
            host: "https://3b8c4cc9dda0.ngrok.io",
            prefixUrl: `/api/1/subscribers`,
            debug: true
        });

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
                               name="password" id="password" value={formData.password} onChange={handleChange}
                               placeholder="Enter A Password"/>
                        <label className="label"><span className="label-text">Confirm Password</span></label>
                        <input className="input input-bordered w-full" type="password"
                               name="password_confirmation" id="password_confirmation"
                               value={formData.password_confirmation} onChange={handleChange}
                               placeholder="Re-Enter Your Password"/>
                        <div className="form-control justify-center mt-5">
                            <button
                                className="btn btn-outline submit">
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