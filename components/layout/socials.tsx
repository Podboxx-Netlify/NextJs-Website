import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconDefinition} from '@fortawesome/free-brands-svg-icons'

interface SocialsProps {
    href: string,
    icon?: IconDefinition,
    text?: string
}

export default function Socials(props: SocialsProps) {
    return (
        <>
            {props.href !== null &&
            <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 mx-2">
                {props.text !== undefined ?
                    <p className="text-lg">{props.text}</p> :
                    <FontAwesomeIcon icon={props.icon} size='lg'/>}
            </a>
            }
        </>
    )
}