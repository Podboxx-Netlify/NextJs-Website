function userReducer(state, action) {
    switch (action.type) {
        case 'SIGN_IN': return {
            ...state,
            isLogged: true,
            isLoading: false,
            user: action.user,
            error: false
        }
        case 'SIGN_UP': return {
            ...state,
            isLogged: true,
            isLoading: false,
            user: action.user,
            error: false
        }
        case 'SIGN_OUT': return {
            ...state,
            isLogged: false,
            isLoading: false,
            user: {},
            error: false
        }
        case 'VERIFY_LOGIN': return {
            ...state,
            isLogged: true,
            isLoading: false,
            user: action.user,
            error: false
        }
        case 'GET_TOKEN': return {
            ...state,
            isLoading: false,
            token: action.token,
            error: false
        }
        case 'FETCH_CHANNEL': return {
            ...state,
            isLoading: false,
            channel: action.channel,
            error: false
        }
        case 'FETCH_HEADERS': return {
            ...state,
            isLoading: false,
            headers: action.headers,
            error: false
        }
        case 'FETCH_SUBSCRIPTIONS': return {
            isLoading: false,
            subscriptions: action.subscriptions,
            error: false
        }
        case 'LOADING': return {
            ...state,
            isLogged: false,
            isLoading: true,
            user: {},
            error: false
        }
        case 'ERROR': return {
            ...state,
            isLogged: false,
            isLoading: false,
            user: {},
            error: true
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