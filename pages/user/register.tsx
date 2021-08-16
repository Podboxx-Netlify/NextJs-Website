import JtockAuth from 'j-tockauth'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import validator from 'validator'
import { ErrorNotification, SuccessNotification } from '../../components/notification'
import { Props, UserContext } from '../../components/userContext/user-context'

const Register: React.FC = () => {
	const router = useRouter()
	const [error, setError] = useState<string[]>([])
	const [passwordScore, setPasswordScore] = useState<number>(0)
	const [passwordColor, setPasswordColor] = useState<string>('progress progress-error')
	const { userState, userDispatch } = useContext<Props>(UserContext)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: '',
	})

	const verifyData = () => {
		const errors = []
		!validator.isEmail(formData.email) && errors.push('Email is invalid.')
		!validator.isStrongPassword(formData.password, { minSymbols: 0 }) &&
			errors.push('Password needs at least 8 characters, 1 number, 1 lowercase and 1 uppercase.')
		formData.password !== formData.password_confirmation &&
			errors.push('Your password confirmation does not match.')
		!validator.isAlpha(formData.first_name) && errors.push('First name cannot have numbers.')
		!validator.isAlpha(formData.last_name) && errors.push('Last name cannot have numbers.')
		validator.isEmpty(formData.first_name) && errors.push('First name cannot be empty.')
		validator.isEmpty(formData.last_name) && errors.push('Last name cannot be empty.')
		setError(errors)
		return errors.length > 0
	}

	const handleChange = (e) => {
		setFormData((data) => ({ ...data, [e.target.id]: e.target.value }))
	}

	const onPasswordChange = (e) => {
		handleChange(e)
		setPasswordScore(
			validator.isStrongPassword(e.target.value, {
				returnScore: true,
				pointsForContainingLower: 6,
				pointsForContainingUpper: 6,
				pointsForContainingNumber: 6,
				pointsForContainingSymbol: 6,
			})
		)
		switch (true) {
			case passwordScore > 0 && passwordScore < 15:
				setPasswordColor('progress progress-error')
				break
			case passwordScore >= 15 && passwordScore < 25:
				setPasswordColor('progress progress-warning')
				break
			case passwordScore >= 25:
				setPasswordColor('progress progress-success')
				break
			default:
				setPasswordColor('progress progress-error')
				break
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (verifyData()) return
		const auth = new JtockAuth({
			host: process.env.NEXT_PUBLIC_API_URL,
			prefixUrl: `${userState.channel}/subscribers`,
			debug: false,
		})
		userDispatch({ type: 'LOADING' })
		auth
			.signUp(
				{
					email: formData.email,
					password: formData.password,
					password_confirmation: formData.password_confirmation,
					first_name: formData.first_name,
					last_name: formData.last_name,
				},
				`${window.location.origin}/user/login`
			)
			.then(() => {
				userDispatch({ type: 'SIGN_UP' })
				SuccessNotification(userDispatch, 'Account successfully created', 'sign_up')
				router.push('/user/login').then()
			})
			.catch(() => {
				userDispatch({ type: 'ERROR' })
				ErrorNotification(userDispatch, 'There was an error when creating your account.', 'sign_up')
				error.push('There was an error when creating your account.')
			})
	}

	return (
		<div className='grid place-items-center mb-10 mt-10 '>
			<div className='card bg-12dp shadow-md lg:w-4/12'>
				<div className='form-control card-body'>
					<div className='text-center text-3xl font-bold card-title'>Register</div>
					{error.length > 0 &&
						error.map((e) => (
							<span key={e} className='w-full text-error'>
								{e}
							</span>
						))}
					<form
						name='registration_form'
						id='registration_form'
						onSubmit={handleSubmit}
						action=''
						autoComplete='on'>
						<label className='label'>
							<span className='label-text'>First Name</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='text'
							autoComplete='given-name'
							name='first_name'
							id='first_name'
							value={formData.first_name}
							onChange={handleChange}
							placeholder='Enter Your First Name'
						/>
						<label className='label'>
							<span className='label-text'>Last Name</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='text'
							name='last_name'
							id='last_name'
							value={formData.last_name}
							autoComplete='family-name'
							onChange={handleChange}
							placeholder='Enter Your Last Name'
						/>
						<label className='label'>
							<span className='label-text'>Email</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='email'
							autoComplete='email'
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
							autoComplete='new-password'
							name='password'
							id='password'
							value={formData.password}
							onChange={onPasswordChange}
							placeholder='Enter A Password'
						/>
						<progress className={passwordColor} value={passwordScore} max={50} />
						<label className='label'>
							<span className='label-text'>Confirm Password</span>
						</label>
						<input
							className='input input-bordered w-full'
							type='password'
							name='password_confirmation'
							id='password_confirmation'
							autoComplete='new-password'
							value={formData.password_confirmation}
							onChange={handleChange}
							placeholder='Re-Enter Your Password'
						/>
						<div className='form-control justify-center mt-5'>
							<button
								className={userState.isLoading ? 'btn btn-outline loading' : 'btn btn-outline'}>
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
