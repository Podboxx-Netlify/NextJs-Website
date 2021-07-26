import {useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import {Props, UserContext} from "./userContext/user-context";
import FullScreenLoader from "./fullscreen-loader";

export default function PrivateRoute({ protectedRoutes, children }) {
    const router = useRouter();
    const {userState, userDispatch} = useContext<Props>(UserContext)


    const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

    // useEffect(() => {
    //     if (!userState.isLoading && !userState.isLogged && !userState.isLoading && pathIsProtected) {
    //         console.log('redirect', !userState.isLoading, !userState.isLogged, pathIsProtected)
    //         // Redirect route, you can point this to /login
    //         router.push('/user/login').then();
    //     }
    // }, [userState, pathIsProtected]);

    if ((userState.isLoading || !userState.isLogged) && pathIsProtected) {
        return <FullScreenLoader />;
    }

    return children;
}