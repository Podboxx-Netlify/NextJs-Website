import Axios from 'axios'
import {useRouter} from 'next/router'
import React, {useContext, useState} from 'react'
import validator from 'validator'

import {ErrorNotification, SuccessNotification} from '../../components/notification'
import {Props, UserContext} from '../../components/userContext/user-context'

// // export default function Edit() {
// const router = useRouter()
// console.log(router.query)
// // if (router.query.channel_id === undefined || router.query.token === undefined)
// // return router.push('/user/login').then()
// const auth = new JtockAuth({
// 	host: process.env.NEXT_PUBLIC_API_URL,
// 	prefixUrl: `${router.query.channel_id}/subscribers`,
// 	debug: true,
// })
// auth
// 	.updatePasswordByToken(
// 		router.query.token as string,
// 		'http://localhost:5000/user/password/reset_password'
// 	)
// 	.then((r) => console.log(r))
// 	.catch(() => {
// 		ErrorNotification(null, 'There was an error while signing in.', 'edit')
// 		router.push('/user/login').then()
// 		// 	setLoginError('Please verify your credentials and try again.')
// 	})
// return <></>
// }
//?channel_id=7&token=uNieZt-N7XUaUpvC6pcg
const ResetPassword: React.FC = () => {
	const router = useRouter()
	const [error, setError] = useState<string[]>([])
	const [passwordScore, setPasswordScore] = useState<number>(0)
	const [passwordColor, setPasswordColor] = useState<string>('progress progress-error')
	const { userState, userDispatch } = useContext<Props>(UserContext)
	const [formData, setFormData] = useState({
		password: '',
		password_confirmation: '',
	})
	console.log(router.query['uid'])
	// function validateToken() {
	// 	const auth = new JtockAuth({
	// 		host: process.env.NEXT_PUBLIC_API_URL,
	// 		prefixUrl: `7/subscribers`,
	// 		debug: true,
	// 	})
	// 	auth
	// 		.updatePasswordByToken(
	// 			'uNieZt-N7XUaUpvC6pcg',
	// 			'http://localhost:5000/user/password/reset_password'
	// 		)
	// 		.then((r) => console.log(r))
	// 		.catch(() => {
	// 			// ErrorNotification(null, 'There was an error while signing in.', 'edit')
	// 			router.push('/user/login').then()
	// 		})
	// }
	//
	// useEffect(() => {
	// 	validateToken()
	// }, [])

	//http://localhost:5000/user/reset_password?channel=31&access-token=Ob2YVI6I2xyirrfI3Tb3NA&client=zREVqo90BzC2X5GMlkHKOA&client_id=zREVqo90BzC2X5GMlkHKOA&config=&expiry=1630336430&reset_password=true&token=Ob2YVI6I2xyirrfI3Tb3NA&uid=tommy.cote%2B3%40podboxx.com
	const handleChange = (e) => {
		console.log(e.target.value)
		setFormData((data) => ({ ...data, [e.target.id]: e.target.value }))
	}

	const verifyPassword = () => {
		const errors = []
		!validator.isStrongPassword(formData.password, { minSymbols: 0 }) &&
			errors.push('Password needs at least 8 characters, 1 number, 1 lowercase and 1 uppercase.')
		formData.password !== formData.password_confirmation &&
			errors.push('Your password confirmation does not match.')
		setError(errors)
		return errors.length > 0
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

	const handleSubmit = async (e) => {
		console.log('handleSubmit')
		e.preventDefault()
		if (verifyPassword()) return
		userDispatch({ type: 'LOADING' })
		await Axios.put(
			`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/auth/password`,
			{
				password: formData.password,
				password_confirmation: formData.password_confirmation,
			},
			{
				headers: {
					client: router.query['client'],
					uid: router.query['uid'],
					'access-token': router.query['access-token'],
				},
			}
		)
			.then(() => SuccessNotification(userDispatch, 'Your password has been updated!'))
			.then(() => router.push('/user/login'))
			.catch(() =>
				ErrorNotification(userDispatch, 'There was an error updating your payment method')
			)
	}

	return (
		<div className='w-full grid place-items-center mt-10'>
			<div className='p-2 card bg-12dp shadow-md'>
				<div className='form-control card-body'>
					<div className='text-center text-3xl font-bold card-title mb-5'>Reset Password</div>
					{error.length > 0 &&
						error.map((e) => (
							<span key={e} className='w-full text-error'>
								{e}
							</span>
						))}
					<form name='login_form' id='login_form' onSubmit={handleSubmit} action=''>
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
								className={userState?.isLoading ? 'btn btn-outline loading' : 'btn btn-outline'}>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
export default ResetPassword
