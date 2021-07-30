import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconDefinition} from '@fortawesome/free-brands-svg-icons'
import clsx from "clsx";

interface SocialsProps {
    href: string,
    icon?: IconDefinition,
    text?: string,
    mobile?: boolean,
}

export default function Socials(props: SocialsProps) {
    return (
        <>
            {props.href !== null &&
            <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx("hover:text-red-500", props.mobile ? 'text-center w-full':'mx-2')}>
                {props.text !== undefined ?
                    <p className={clsx("text-lg", props.mobile && 'text-center w-full')}>{props.text}</p> :
                    <FontAwesomeIcon icon={props.icon} size='lg'/>}
            </a>
            }
        </>
    )
}