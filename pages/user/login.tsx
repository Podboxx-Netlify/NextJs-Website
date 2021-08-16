import JtockAuth from 'j-tockauth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ErrorNotification, SuccessNotification } from '../../components/notification'
import { Props, UserContext } from '../../components/userContext/user-context'

const Login: React.FC = () => {
	const router = useRouter()
	const [loginError, setLoginError] = useState<string>('')
	const { userState, userDispatch } = useContext<Props>(UserContext)
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const handleChange = (e) => {
		console.log(e.target.value)
		setFormData((data) => ({ ...data, [e.target.id]: e.target.value }))
	}

	const handleSubmit = (e) => {
		console.log('handleSubmit')
		e.preventDefault()
		const auth = new JtockAuth({
			host: process.env.NEXT_PUBLIC_API_URL,
			prefixUrl: `${userState.channel}/subscribers`,
			debug: false,
		})
		userDispatch({ type: 'LOADING' })
		auth
			.signIn(formData.email, formData.password)
			.then((userData) => {
				userDispatch({ type: 'SIGN_IN', user: userData.data })
				SuccessNotification(userDispatch, 'Signed in successfully', 'sign_up')
				router.push('/').then()
			})
			.catch(() => {
				ErrorNotification(userDispatch, 'There was an error while signing in.', 'sign_up')
				setLoginError('Please verify your credentials and try again.')
			})
	}

	return (
		<div className='w-full grid place-items-center mt-10'>
			<div className='p-2 card bg-12dp shadow-md'>
				<div className='form-control card-body'>
					<div className='text-center text-3xl font-bold card-title'>Sign In</div>
					<form name='login_form' id='login_form' onSubmit={handleSubmit} action=''>
						<label className='label'>
							<span className='label-text'>Email</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='text'
							name='email'
							id='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='Enter Your Email'
						/>
						<label className='label'>
							<span className='label-text'>Password</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='password'
							name='password'
							id='password'
							value={formData.password}
							onChange={handleChange}
							placeholder='Enter A Password'
						/>
						<span className='label-text-alt'>
							<Link href='/user/forgot_password'>Forgot password?</Link>
						</span>
						<div className='form-control justify-center mt-5'>
							<div className='text-error'>{loginError !== '' && loginError}</div>
							<button
								className={userState?.isLoading ? 'btn btn-outline loading' : 'btn btn-outline'}>
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
