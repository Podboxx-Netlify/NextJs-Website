import Link from "next/link";
import React from "react";


function SignUpButton(props) {
    return (
        <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap text-lg font-medium capitalize"
                onClick={props.router}>
            {props.mobile !== true &&
            <svg height="24px" strokeWidth="2"
                 viewBox="0 0 24 24" width="24px" fill="#FFFFFF"
                 className="inline-block w-5 mr-2 stroke-current">
                <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>}
            <Link href="/user/register">Register</Link>
        </button>
    )
}

function SignInButton(props) {
    return (
        <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap text-lg font-medium capitalize"
                onClick={props.router}>
            {props.mobile !== true &&
            <svg height="24px" strokeWidth="2"
                 viewBox="0 0 24 24" width="24px" fill="#FFFFFF"
                 className="inline-block w-5 mr-2 stroke-current">
                <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>}
            <Link href="/user/login">Sign In</Link>
        </button>
    )
}

function SignOutButton(props) {
    return (
        <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap text-lg font-medium capitalize"
                onClick={props.router}>
            {props.mobile !== true &&
            <svg height="24px" strokeWidth="2"
                 viewBox="0 0 24 24" width="24px" fill="#FFFFFF"
                 className="inline-block w-5 mr-2 stroke-current">
                <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>}
            {props?.link}
        </button>
    )
}

// function UserButton(props) {
//     return (
//         <button className="btn btn-ghost rounded-btn btn-sm whitespace-nowrap text-lg font-medium capitalize"
//                 onClick={props.router}>
//             {props.mobile !== true &&
//             <svg height="24px" strokeWidth="2"
//                  viewBox="0 0 24 24" width="24px" fill="#FFFFFF"
//                  className="inline-block w-5 mr-2 stroke-current">
//                 <path
//                     d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//             </svg>}
//             {props?.link}
//         </button>
//     )
// }

export {
    SignUpButton,
    SignInButton,
    SignOutButton
}