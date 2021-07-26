import JtockAuth from "j-tockauth";


export const signOut = (channel, userDispatch) => {

    const auth = new JtockAuth({
        host: process.env.NEXT_PUBLIC_API_URL,
        prefixUrl: `${channel}/subscribers`,
        debug: true
    });

    if (localStorage.getItem('J-tockAuth-Storage') !== null) {
        auth
            .signOut()
            .then(() => userDispatch({type: 'SIGN_OUT'}))
            .catch(error => {
                userDispatch({type: 'ERROR'})
                console.log(error);
            });
    }
}