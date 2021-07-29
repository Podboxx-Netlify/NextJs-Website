import {toast} from "react-toastify";
import NProgress from 'nprogress'

function userReducer(state, action) {
    switch (action.type) {
        case 'SIGN_IN': {
            NProgress.done()
            console.log('SIGN_IN')
            return {
                ...state,
                isLogged: true,
                isLoading: false,
                user: action.user,
                error: false
            }
        }
        case 'SIGN_UP': {
            console.log('SIGN_UP')
            NProgress.done()
            return {
                ...state,
                isLogged: true,
                isLoading: false,
                user: {},
                error: false
            }
        }
        case 'SIGN_OUT': {
            console.log('SIGN_OUT')
            NProgress.done()
            return {
                ...state,
                isLogged: false,
                isLoading: false,
                user: {},
                error: false
            }
        }
        case 'VERIFY_LOGIN': {
            console.log('VERIFY_LOGIN')
            NProgress.done()
            return {
                ...state,
                isLogged: true,
                isLoading: false,
                user: action.user,
                error: false
            }
        }
        case 'GET_TOKEN': {
            console.log('GET_TOKEN')
            NProgress.done()
            return {
                ...state,
                isLoading: false,
                token: action.token,
                error: false
            }
        }
        case 'FETCH_CHANNEL': {
            console.log('FETCH_CHANNEL')
            NProgress.done()
            return {
                ...state,
                isLoading: false,
                channel: action.channel,
                error: false
            }
        }
        case 'FETCH_HEADERS': {
            console.log('FETCH_HEADERS')
            NProgress.done()
            return {
                ...state,
                isLoading: false,
                headers: action.headers,
                error: false
            }
        }
        case 'FETCH_SUBSCRIPTIONS': {
            console.log('FETCH_SUBSCRIPTIONS')
            NProgress.done()
            return {
                ...state,
                isLoading: false,
                subscriptions: action.subscriptions,
                error: false
            }
        }
        case 'LOADING': {
            console.log('LOADING')
            NProgress.start()
            return {
                ...state,
                isLoading: true
            }
        }
        case 'STOP_LOADING': {
            console.log('STOP_LOADING')
            NProgress.done()
            return {
                ...state,
                isLoading: false
            }
        }
        case 'ERROR': {
            console.log('ERROR')
            NProgress.done()
            toast.error('Error! Please try again', {
                toastId: 'ErrorNotification',
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return {
                ...state,
                isLogged: false,
                isLoading: false,
                user: {},
                error: true
            }
        }
        case 'UPDATE_USER': {
            break;
        }
        default: {
            console.log(`Unhandled action type: ${action.type}`)
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

export default userReducer