import { ErrorNotification } from '../components/notification'

export default async function fetcher<JSON = any>(input: RequestInfo): Promise<JSON> {
	const headers = JSON.parse(localStorage.getItem('J-tockAuth-Storage'))
	const res = await fetch(input, {
		headers: {
			uid: (headers !== null && headers['uid']) || null,
			client: (headers !== null && headers['client']) || null,
			'access-token': (headers !== null && headers['access-token']) || null,
			channel: JSON.parse(localStorage.getItem('channel')) || null,
		},
	})

	if (res.status === 403) {
		ErrorNotification(null, 'You are not authorized to access this resource.', 'error')
		throw new Error('You are not authorized to access this resource.')
	}

	return res.json()
}
