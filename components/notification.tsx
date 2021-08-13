import NProgress from 'nprogress'
import React from 'react'
import { toast } from 'react-toastify'

function SuccessNotification(
	dispatch?: React.Dispatch<{ type: string }>,
	message?: string,
	id?: string
) {
	NProgress.done()
	dispatch !== null && dispatch({ type: 'STOP_LOADING' })
	toast.success(message ? message : 'Success!', {
		toastId: id ? id : 'success',
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	})
}

function ErrorNotification(
	dispatch?: React.Dispatch<{ type: string }>,
	message?: string,
	id?: string
) {
	NProgress.done()
	dispatch !== null && dispatch({ type: 'STOP_LOADING' })
	toast.error(message ? message : 'Error', {
		toastId: id ? id : 'error',
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	})
}

export { SuccessNotification, ErrorNotification }
