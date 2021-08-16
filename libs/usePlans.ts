import useSWR from 'swr'
import fetcher from './fetcher'

export default function usePlans(channel_id) {
	const { data, error } = useSWR(
		`${process.env.NEXT_PUBLIC_URL}${channel_id}/subscription_plans/list`,
		fetcher
	)

	return {
		channelPlans: data,
		isPlansLoading: !error && !data,
		isPlansError: error,
	}
}
