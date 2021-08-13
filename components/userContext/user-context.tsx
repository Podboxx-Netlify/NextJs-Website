import JtockAuth from 'j-tockauth'
import React, { useEffect, useReducer } from 'react'
import UserReducer from './user-reducer'

export interface Props {
	userState?: {
		isLoading: boolean
		isLogged: boolean
		user: Record<string, unknown>
		error: boolean
		channel: number | string
		subscriptions: string[]
	}
	userDispatch?: React.Dispatch<{
		type: string
		user?: Record<string, unknown>
		channel?: string | number
	}>
	isLoading: boolean
	isLogged: boolean
	user: Record<string, unknown>
	channel: number | string
	subscriptions: string[]
	error: boolean
}

const initialState = {
	isLoading: false,
	isLogged: false,
	user: {},
	channel: null,
	subscriptions: [],
	error: false,
}

const UserProvider = ({ children }) => {
	const [userState, userDispatch] = useReducer(UserReducer, initialState)

	useEffect(() => {
		// Wait for the client to be loaded before calling fetchChannel
		if (typeof window !== 'undefined') {
			fetchChannel()
		}
	}, [])

	const isAuth = () => {
		const auth = new JtockAuth({
			host: process.env.NEXT_PUBLIC_API_URL,
			prefixUrl: `${localStorage.getItem('channel')}/subscribers`,
			debug: false,
		})
		localStorage.getItem('J-tockAuth-Storage') !== null && userDispatch({ type: 'LOADING' })
		auth
			.validateToken(auth.tokenHeaders())
			.then((r) =>
				userDispatch({
					type: 'VERIFY_LOGIN',
					user: r.data,
				})
			)
			.catch(() => localStorage.getItem('J-tockAuth-Storage') !== null && auth.signOut())
	}

	// If channel isn't null && channel != userState.channel => Dispatch to state with new id
	// Then call isAuth to validate login
	const fetchChannel = () => {
		localStorage.getItem('channel') !== null &&
			localStorage.getItem('channel') !== userState.channel &&
			userDispatch({ type: 'FETCH_CHANNEL', channel: localStorage.getItem('channel') })
		localStorage.getItem('channel') !== null && isAuth()
	}

	return (
		// @ts-ignore
		<UserContext.Provider value={{ userState, userDispatch }}>{children}</UserContext.Provider>
	)
}
const UserContext = React.createContext<Props>(initialState)
export default UserProvider
export { UserContext }
