import Axios from 'axios'
import { client, hostedFields } from 'braintree-web'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { ErrorNotification, SuccessNotification } from '../../components/notification'
import { Props, UserContext } from '../../components/userContext/user-context'
import fetcher from '../../libs/fetcher'
import usePlans from '../../libs/usePlans'
// import useBreakpoints from '../../libs/useBreakpoints'
import useTimeoutFn from '../../libs/useTimeoutFn'

interface UserProfile {
	id: number
	email: string
	first_name: string
	last_name: string
	payment_method: {
		expiration_month: string
		expiration_year: string
		image_url: string
		number: string
		payment_type: string
		token: string
	}
	subscription: {
		id: number
		ends_at: string
		next_billing_date: string
		next_billing_address: number
		next_billing_amount: number
		status: string
		payment_method: {
			expiration_month: string
			expiration_year: string
			image_url: string
			number: string
			payment_type: string
			token: string
		}
		subscription_plan: {
			name: string
		}
	}
}

export type { UserProfile }

const Subscriptions: React.FC = () => {
	const router = useRouter()
	// const {isXs, isSm, isMd, isLg, active} = useBreakpoints();
	const [cancel] = useTimeoutFn(() => router.push('/user/login'), 5000)
	const [formError, setFormError] = useState([])
	const { userState, userDispatch } = useContext<Props>(UserContext)
	const { channelPlans } = usePlans(userState.channel)
	const { data, mutate } = useSWR<UserProfile>(
		`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/profile`,
		fetcher,
		{
			onErrorRetry: (error) => {
				if (error.message.includes('not authorized')) return
			},
		}
	)

	useEffect(() => {
		if (userState?.isLogged === true) cancel()
		if (userState?.isLogged && data) channelPlans && getToken().then((res) => instance(res, data))
	}, [userState?.isLogged, data])

	const getToken = async () => {
		const response =
			!!userState.channel &&
			(await Axios.get(`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/client_token`))
		return response && response.data?.client_token
	}

	const destroyPaymentMethod = async (token: string) => {
		const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
		await Axios.delete(
			`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods/${token}`,
			{
				headers: {
					uid: headers['uid'],
					client: headers['client'],
					'access-token': headers['access-token'],
				},
			}
		)
			.then((e) =>
				e.data['message'].includes('please cancel your subscription first')
					? ErrorNotification(
							userDispatch,
							'Could not delete your payment method, please cancel your subscription first!',
							'destroyPayment'
					  )
					: SuccessNotification(
							userDispatch,
							'Your payment method has been deleted!',
							'destroyPayment'
					  )
			)
			.catch(() =>
				ErrorNotification(userDispatch, 'There was an error deleting your payment method')
			)
			.then(() => mutate())
	}

	const handleSubmit = async (nonce: string, data: UserProfile) => {
		const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
		userDispatch({ type: 'LOADING' })
		if (userState.user['id'] !== null) {
			if (!!data?.payment_method) {
				await Axios.put(
					`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods/${data?.payment_method.token}`,
					{
						nonce_from_the_client: nonce,
						uid: headers['uid'],
						client: headers['client'],
						'access-token': headers['access-token'],
					}
				)
					.then(() => SuccessNotification(userDispatch, 'Your payment method has been updated!'))
					.catch(() =>
						ErrorNotification(userDispatch, 'There was an error updating your payment method')
					)
					.then(() => mutate())
			} else {
				await Axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}${userState.channel}/subscribers/${userState.user['id']}/payment_methods`,
					{
						nonce_from_the_client: nonce,
						uid: headers['uid'],
						client: headers['client'],
						'access-token': headers['access-token'],
					}
				)
					.then(() => SuccessNotification(userDispatch, 'Your payment method has been created!'))
					.catch(() =>
						ErrorNotification(userDispatch, 'There was an error creating your payment method')
					)
					.then(() => mutate())
			}
		}
	}

	const handleCreatePlan = async (selected_plan: number) => {
		const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
		userDispatch({ type: 'LOADING' })
		data?.subscription?.status.includes('Active') && (await handleCancelPlan())
		await Axios.post(
			`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/create_subscription`,
			{
				subscriber_id: userState.user['id'],
				payment_token: data?.payment_method?.token,
				selected_plan: selected_plan,
				uid: headers['uid'],
				client: headers['client'],
				'access-token': headers['access-token'],
			}
		)
			.then(() => SuccessNotification(userDispatch, 'Successfully subscribed!', 'createPlan'))
			.catch(() => ErrorNotification(userDispatch, 'There was an error subscribing', 'createPlan'))
			.then(() => mutate())
	}

	const handleCancelPlan = async () => {
		const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
		userDispatch({ type: 'LOADING' })
		await Axios.post(
			`${process.env.NEXT_PUBLIC_URL}${userState.channel}/payment/cancel_subscription`,
			{
				subscriber_id: userState.user['id'],
				subscription_id: data?.subscription?.id,
				uid: headers['uid'],
				client: headers['client'],
				'access-token': headers['access-token'],
			}
		)
			.then(() => SuccessNotification(userDispatch, 'Successfully cancelled!', 'cancelPlan'))
			.catch(() =>
				ErrorNotification(userDispatch, 'There was an error unsubscribing', 'cancelPlan')
			)
			.then(() => mutate())
	}

	const instance = (token: string, data: UserProfile) => {
		client.create(
			{
				authorization: token,
			},
			(err, clientInstance) => {
				if (err) {
					console.error(err)
					return
				}
				createHostedFields(clientInstance, data)
			}
		)
	}

	const createHostedFields = (clientInstance, data) => {
		hostedFields.create(
			{
				client: clientInstance,
				styles: {
					input: {
						'font-size': '16px',
						'font-family': 'courier, monospace',
						'font-weight': 'lighter',
						color: '#ccc',
					},
					':focus': {
						color: '#FFF',
					},
					'.valid': {
						color: '#8bdda8',
					},
					'.invalid': {
						color: '#e00737',
					},
				},
				fields: {
					number: {
						selector: '#card-number',
						placeholder: '4111 1111 1111 1111',
					},
					cvv: {
						selector: '#cvv',
						placeholder: '123',
					},
					expirationDate: {
						selector: '#expiration-date',
						placeholder: 'MM/YYYY',
					},
				},
			},
			(err, hostedFieldsInstance) => {
				const form = document.querySelector('#cardForm')
				const tokenize = (event) => {
					event.preventDefault()
					hostedFieldsInstance?.tokenize(function (err, payload) {
						if (err) {
							err.details?.invalidFieldKeys?.length >= 1 &&
								err.details.invalidFieldKeys.forEach((key) => hostedFieldsInstance.clear(key))
							setFormError(err.details?.invalidFieldKeys)
							return
						}
						handleSubmit(payload.nonce, data).then()
						hostedFieldsInstance.clear('number')
						hostedFieldsInstance.clear('cvv')
						hostedFieldsInstance.clear('expirationDate')
					})
				}
				form.addEventListener('submit', tokenize, false)
			}
		)
	}

	if (!userState?.isLogged || !data) return <div className='cover-spin' id='cover-spin' />
	return (
		<div className='w-full grid place-items-center mt-10'>
			<div className='p-2 card bg-08dp shadow-md'>
				<div className='form-control card-body'>
					<div className='text-center text-3xl font-bold card-title'>Subscriptions</div>
					<div className='grid grid-cols-1 lg:grid-cols-2 lg:mx-10'>
						<div className='card shadow-md lg:card-side bg-12dp text-primary-content'>
							<div className='card-body'>
								<p className='text-xl'>Payment Method</p>
								{data?.payment_method && (
									<div className='rounded-box border border-primary p-2 lg:p-4 whitespace-nowrap lg:mr-5 my-2'>
										<div className='whitespace-nowrap text-lg'>
											{data?.payment_method.expiration_month +
												'/' +
												data?.payment_method.expiration_year +
												' '}
											{data?.payment_method.number}
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												className='float-left mr-2'
												src={data?.payment_method['image_url']}
												alt={data?.payment_method['payment_type']}
											/>
											<button
												className='btn btn-outline btn-primary rounded-btn btn-sm whitespace-nowrap float-right mt-1 lg:mt-0'
												onClick={() => destroyPaymentMethod(data?.payment_method.token)}>
												Delete
											</button>
										</div>
									</div>
								)}
								<div className='collapse lg:w-96 rounded-box border border-base-300 collapse-arrow'>
									<input type='checkbox' />
									<div className='collapse-title text-xl font-medium'>
										{data?.payment_method ? 'Edit Payment Method' : 'Add a Payment Method'}
									</div>
									<div className='collapse-content p-0'>
										<form id='cardForm' className='p-0'>
											<label
												htmlFor='card-number'
												className={formError?.includes('number') ? 'text-error' : ''}>
												Card Number
											</label>
											<div id='card-number' className='hosted-field mt-3' />
											<label
												htmlFor='expiration-date'
												className={formError?.includes('expirationDate') ? 'text-error' : ''}>
												Expiration Date
											</label>
											<div id='expiration-date' className='hosted-field mt-3' />
											<label
												htmlFor='expiration-date'
												className={formError?.includes('cvv') ? 'text-error' : ''}>
												CVV
											</label>
											<div id='cvv' className='hosted-field mt-3' />
											<div className='text-center mt-3'>
												<button
													className={
														userState.isLoading ? 'btn btn-primary loading' : 'btn btn-primary'
													}
													type='submit'>
													{!!data?.payment_method ? 'Update' : 'Create'}
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
						<div className='card shadow-md lg:card-side bg-12dp text-primary-content lg:ml-5 mt-4 w-full lg:mt-0'>
							<div className='card-body'>
								<p className='text-2xl'>Plans</p>
								{!!channelPlans && Object.keys(channelPlans).length > 0 && (
									<>
										{Object.keys(channelPlans).map((value, index) => (
											<div
												key={index}
												className={
													data?.subscription?.subscription_plan?.name?.indexOf(value) !== -1 &&
													data?.subscription?.status.includes('Active')
														? 'lg:w-96 rounded-box rounded-xl border border-success p-2 my-2 bg-24dp'
														: 'lg:w-96 rounded-box rounded-xl border border-primary my-2 bg-24dp'
												}>
												<div className='text-2xl font-medium capitalize mt-2 mx-2 lg:mx-0 lg:text-center'>
													{value}
													<span
														className={
															data?.subscription?.subscription_plan?.name?.indexOf(value) !== -1 &&
															data?.subscription?.status.includes('Active')
																? 'badge badge-success mb-2 lg:mb-0 ml-2 lg:ml-5 '
																: 'badge badge-primary mb-2 lg:mb-0 ml-2 lg:ml-5 '
														}>
														{'$' + channelPlans[value]['price']}{' '}
														{channelPlans[value]['billing_cycle'] <= 11 ? 'per month' : 'per year'}
													</span>
												</div>
												<span className='text-center'>
													{data?.subscription?.subscription_plan?.name?.indexOf(value) !== -1 && (
														<p
															className={
																data?.subscription?.status?.includes('Active')
																	? 'text-success text-xl'
																	: ''
															}>
															{data?.subscription?.status}
														</p>
													)}
												</span>
												<div className='lg:m-3 p-1 flex flex-auto flex-wrap lg:flex-nowrap white-space justify-end'>
													<div className=''>
														{data?.subscription &&
														data?.subscription?.subscription_plan?.name?.indexOf(value) !== -1 &&
														data?.subscription?.status?.includes('Active') ? (
															<button
																disabled={!data?.payment_method}
																className='btn btn-primary btn-outline rounded-btn btn-sm mb-2 text-xs lg:text-md btn-block lg:whitespace-nowrap'
																onClick={handleCancelPlan}>
																Cancel subscription
															</button>
														) : (
															<button
																disabled={!data?.payment_method}
																className='btn btn-outline border-success text-success rounded-btn btn-sm mb-2 whitespace-nowrap justify-center hover:bg-success hover:border-success hover:text-white'
																onClick={() => handleCreatePlan(channelPlans[value]['_id'])}>
																{data?.subscription?.status?.includes('Active')
																	? 'Change Plan'
																	: 'Subscribe'}
															</button>
														)}
													</div>
												</div>
											</div>
										))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Subscriptions
