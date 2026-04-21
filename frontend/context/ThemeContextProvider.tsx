'use client'

import { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

export type ThemeType = 'light' | 'dark'
export type ThemeContextType = [ThemeType, Dispatch<SetStateAction<ThemeType>>]
export const ThemeContext = createContext<ThemeContextType>(null!)


export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {

    const isMounted = useRef<Boolean>(false) /* Used to check if the first render has been executed or not */
    const [theme, setTheme] = useState<ThemeType>(null!) /* On first render, first get no theme, wait for useEffect to get values from local storage */

    /* Interact with external API to get theme stored in Local Storage */
    useEffect(() => {
        isMounted.current = true
        const themeLS = localStorage.getItem('skillTrackerTheme')
        const storedTheme = themeLS && (themeLS === 'light' || themeLS === 'dark') ? themeLS : 'light'
        setTheme(storedTheme)
    }, [])

    /* On second render, then only show the body content */
    if (isMounted.current) {
        return (
            <ThemeContext value={[theme, setTheme]}>
                <body className={`
                    ${theme} min-h-screen
                    text-letter-black dark:text-letter-white
                    bg-background-white dark:bg-background-black
                `}>
                    {children}
                </body>
            </ThemeContext>
        )
    }
    /* On first render, show nothing, to wait for useEffect to trigger */
    else {
        return <body></body>
    }

}