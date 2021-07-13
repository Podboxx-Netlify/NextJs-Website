import NextImage from 'next/image';
import styles from './Image.module.css'
import React from "react";

interface Props {
    src: string
    alt: string
    width?: number|string
    maxWidth?: number|string
    height?: number|string
}

const Image: React.FC<Props> = ({src,alt, width, maxWidth, height,...props}) => {
    let styleWidth = {}
    width ? styleWidth['width'] = width:"100%"
    maxWidth ? styleWidth['maxWidth'] = maxWidth:"100%"
    height && (styleWidth['height'] = height)

    return (
        <div className={styles.imageContainer} style={{height: "80px", width: "200px"}}>
            <NextImage layout='fill' className={styles.image} objectFit="cover" objectPosition="center" alt={alt} src={src} {...props} unoptimized={true} />
        </div>
    )
}

export default Image