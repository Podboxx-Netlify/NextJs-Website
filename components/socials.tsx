import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconDefinition} from '@fortawesome/free-brands-svg-icons'
// const Subscriptions: React.FC = () => {
//
// }
// href: string, icon?: IconDefinition, text?: string
interface SocialsProps {
    href: string,
    icon?: IconDefinition,
    text?: string
}

export default function Socials(props: SocialsProps) {
    console.log(props.href, props.icon, props.text)
    return (
        <>
            {props.href !== null &&
            <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-red-500 mx-2"
            >

                {props.text !== undefined ?
                    <p className="text-lg">{props.text}</p> :
                    <FontAwesomeIcon icon={props.icon} size='lg'/>
                }
            </a>
            }
        </>
    )
}