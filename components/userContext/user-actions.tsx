// import {useContext} from "react";
// import {Props, UserContext} from "./user-context";
// import JtockAuth from "j-tockauth";
//
//
// async function IsAuth() {
//     const {userState} = useContext<Props>(UserContext)
//
//
//
// }
//
// async function SignIn() {
//
//     const auth = new JtockAuth({
//         host: process.env.NEXT_PUBLIC_API_URL,
//         prefixUrl: `${userState.channel}/subscribers`,
//         debug: true
//     });
//     userDispatch({type: 'LOADING'})
//     auth
//         .signIn(formData.email, formData.password)
//         .then(userData => {
//             userDispatch({type: 'SIGN_IN', user: userData.data})
//             router.push('/')
//         })
//         .catch(error => {
//             userDispatch({type: 'ERROR'})
//             setLoginError('Please verify your credentials and try again.')
//             // console.log(error);
//         });
// }
export {}
// export {
//     SignIn,
//     IsAuth
// }
//
