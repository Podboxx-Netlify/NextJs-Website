function userReducer(state, action) {
    switch (action.type) {
        case 'SIGN_IN': {
            console.log('sign_in')
            return {
                isLogged: true,
                isLoading: false,
                user: action.user,
                error: false
            }
        }
        case 'SIGN_UP': {
            console.log('sign_up')
            return {
                isLogged: true,
                isLoading: false,
                user: action.user,
                error: false
            }
        }
        case 'SIGN_OUT': {
            console.log('sign_out')
            return {
                isLogged: false,
                isLoading: false,
                user: {},
                error: false
            }
        }
        case 'LOADING': {
            return {
                isLogged: false,
                isLoading: true,
                user: {},
                error: false
            }
        }
        case 'ERROR': {
            return {
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