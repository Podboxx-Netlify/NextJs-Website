import JtockAuth from 'j-tockauth'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import validator from 'validator'
import { ErrorNotification, SuccessNotification } from '../../components/notification'
import { Props, UserContext } from '../../components/userContext/user-context'

const ForgotPassword: React.FC = () => {
	const router = useRouter()
	const { userState, userDispatch } = useContext<Props>(UserContext)
	const [emailError, setEmailError] = useState<string>('')
	const [formData, setFormData] = useState({
		email: '',
	})

	const handleChange = (e) => {
		console.log(e.target.value)
		setFormData((data) => ({ ...data, [e.target.id]: e.target.value }))
	}

	const verifyEmail = () => {
		let error = ''
		if (!validator.isEmail(formData.email)) error = 'Email is invalid.'
		setEmailError(error)
		return error === ''
	}

	const handleSubmit = (e) => {
		console.log('handleSubmit')
		e.preventDefault()
		if (!verifyEmail()) return
		const auth = new JtockAuth({
			host: process.env.NEXT_PUBLIC_API_URL,
			prefixUrl: `${userState.channel}/subscribers`,
			debug: false,
		})
		userDispatch({ type: 'LOADING' })
		auth
			.resetPassword(
				formData.email,
				'http://localhost:5000/user/reset_password?channel=' + userState.channel
			)
			.then(() => {
				SuccessNotification(
					userDispatch,
					'You should receive an email with the instructions to reset your password.',
					'forgot-password'
				)
				router.push('/').then()
			})
			.catch(() => {
				ErrorNotification(
					userDispatch,
					'There was an error while trying to reset your password.',
					'forgot-password'
				)
			})
	}

	return (
		<div className='w-full grid place-items-center mt-10'>
			<div className='p-2 card bg-12dp shadow-md'>
				<div className='form-control card-body'>
					<div className='text-center text-3xl font-bold card-title mb-5'>Forgot Password</div>
					<form
						name='forgot_password_form'
						id='forgot_password_form'
						onSubmit={handleSubmit}
						action=''>
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
						<div className='form-control justify-center mt-5'>
							<div className='text-error'>{emailError !== '' && emailError}</div>
							<button
								className={userState?.isLoading ? 'btn btn-outline loading' : 'btn btn-outline'}>
								Reset Password
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default ForgotPassword
