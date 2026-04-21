'use client'
import Image from "next/image";
import { motion } from 'motion/react'

export default function AuthLogo() {

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
        >
            <Image
                priority
                src='/icons/wt-chat-logo.png'
                height={850}
                width={320}
                alt='The logo of the website with the subtext of "Your AI Conversation Hub"'
                className='dark:hidden w-full'
            />
            <Image
                priority
                src='/icons/wt-chat-logo-dark.png'
                height={850}
                width={320}
                alt='The logo of the website with the subtext of "Your AI Conversation Hub"'
                className='hidden dark:block w-full'
            />
        </motion.div>
    )
}