import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";

export default function UserButton(props) {
    return (
        <button
            className={clsx(props.dropdown ? "focus:outline-none w-full" : "btn btn-ghost rounded-btn btn-sm ",
                props.currentChannel && "text-green-500 cursor-default", "whitespace-nowrap text-lg font-medium capitalize")}
            onClick={props.onClick}>
            {props.icon &&
            <FontAwesomeIcon icon={props.icon} className='mr-2' size='sm'/>}
            {props?.content}
        </button>
    )
}