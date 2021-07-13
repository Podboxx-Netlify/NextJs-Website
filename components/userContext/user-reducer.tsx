// function userReducer(state, action) {
//     switch (action.type) {
//         case 'SIGN_IN': {
//             // let res = Auth.emailSignIn({
//             //     email: state.email,
//             //     password: state.password
//             // })
//             //     .then(r => {console.log(r)})
//             return {
//                 isLogged: true,
//                 isLoading: false,
//                 user: {},
//                 error: false
//             }
//         }
//         case 'SIGN_UP': {
//             // let res = Auth.emailSignUp({
//             //     email: state.email,
//             //     password: state.password,
//             //     password_confirmation: state.password_confirmation,
//             //     first_name: state.first_name,
//             //     last_name: state.last_name,
//             //     confirm_success_url: 'http://localhost:5000/user/login'
//             // }).then(r => {console.log(r)})
//             return {
//                 isLogged: false,
//                 isLoading: false,
//                 user: action.user,
//                 error: false
//             }
//         }
//         case 'UPDATE_USER': {
//             break;
//         }
//         default: {
//             console.log(`Unhandled action type: ${action.type}`)
//             throw new Error(`Unhandled action type: ${action.type}`)
//         }
//     }
// }
//
//
// export default userReducer
export {}