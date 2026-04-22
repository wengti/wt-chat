'use client'

import { UserContext } from "@/context/UserContextClientComponent"
import { useContext } from "react"
import { motion } from 'motion/react'

export default function Greeting() {


    /* Context */
    const { name } = useContext(UserContext)

    /* Time / Greeting */
    const now = new Date()
    const currentHour = now.getHours()
    const greeting = currentHour < 12 ?
        'Good morning' :
        currentHour < 18 ?
            'Good afternoon' :
            'Good evening'



    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className='text-center'
            >
                <h1 className='text-2xl font-bold'>
                    {greeting} {name}
                </h1>
                <h2 className='text-sm font-bold'>
                    What is on your mind today?
                </h2>
            </motion.div>
        </div>
    )
}