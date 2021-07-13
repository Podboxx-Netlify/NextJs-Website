import React, {useEffect, useState} from "react";
import Image from 'next/image'

export default function DarkMode() {
    const [theme, setTheme] = useState<string>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
                setTheme('dark')
            } else {
                document.documentElement.classList.remove('dark')
                setTheme('light')
            }
        }
    }, [])

    const handleThemeChange = (theme: string) => {
        localStorage.theme = theme
        setTheme(theme)
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <div className="text-right">
            {theme === 'dark' ?
                <button onClick={() => handleThemeChange('light')} className='focus:outline-none btn btn-square btn-ghost'>
                    <Image src={"/light_mode_icon.png"} alt="light mode" height={30} width={30}/>
                </button>
                : <button onClick={() => handleThemeChange('dark')} className='focus:outline-none btn btn-square btn-ghost'>
                    <Image src={"/dark_mode_icon.png"} alt="dark mode" height={30} width={30}/>
                </button>
            }
        </div>
    )
}