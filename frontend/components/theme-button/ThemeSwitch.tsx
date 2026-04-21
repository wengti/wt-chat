'use client'
import { ThemeContext, ThemeType } from "@/context/ThemeContextProvider";
import { useContext } from "react";
import { IoMdSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";

export default function ThemeSwitch(){

    const [theme, setTheme] = useContext(ThemeContext)

    function handleSetTheme() {
        setTheme( (prevTheme) => {
            /* State management */
            let newTheme: ThemeType = 'light'
            if (prevTheme === 'light') newTheme = 'dark'
            else if (prevTheme === 'dark') newTheme = 'light'

            /* Save into local storage */
            localStorage.setItem('skillTrackerTheme', newTheme)

            /* Update state */
            return newTheme
        })
    }

    return (
        <button
            onClick={()=> handleSetTheme()}
            className='text-2xl hover:text-hover-green active:text-hover-green'
        >
            {
                theme === 'light' ?
                    <IoMdMoon /> :
                    <IoMdSunny />
            }
        </button>
    )
}