import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { Props, UserContext } from '../components/userContext/user-context'
import fetcher from './fetcher'

export default function useAuth() {
	// console.log(localStorage)
	const { userState, userDispatch } = useContext<Props>(UserContext)

	const { data, error } = useSWR(
		typeof window === 'undefined'
			? null
			: `${process.env.NEXT_PUBLIC_API_URL}${localStorage?.getItem(
					'channel'
			  )}/subscribers/auth/validate_token`,
		fetcher
	)

	useEffect(() => {
		userDispatch({
			type: 'VERIFY_LOGIN',
			user: data as Record<string, unknown>,
		})
	}, [data])

	return {
		isAuth: data,
		isAuthLoading: !error && !data,
		isAuthError: error,
	}
}
