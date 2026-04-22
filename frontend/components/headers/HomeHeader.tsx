'use client'

import Image from "next/image";
import ThemeSwitch from "../theme-button/ThemeSwitch";
import Link from "next/link";
import { LogoutButton } from "../supabase-components/logout-button";
import { Avatar } from "../tailgrids/core/avatar";
import { UserContext } from "@/context/UserContextClientComponent";
import Sidebar from "../sidebar/Sidebar";
import { useContext } from "react";

export default function HomeHeader() {

    const { name, id, picture } = useContext(UserContext)

    


    return (
        <header className={`h-(--header-y) flex justify-between items-center bg-card-white dark:bg-card-black px-2 py-2 sticky top-0 z-2`}>
            <Link href='/' className='h-full'>
                <Image
                    priority
                    src='/icons/wt-chat-logo.png'
                    height={850}
                    width={320}
                    alt='The logo of the website with the subtext of "Your AI Conversation Hub"'
                    className='dark:hidden w-38'
                />
                <Image
                    priority
                    src='/icons/wt-chat-logo-dark.png'
                    height={850}
                    width={320}
                    alt='The logo of the website with the subtext of "Your AI Conversation Hub"'
                    className='hidden dark:block w-38'
                />
            </Link>
            <div className='flex gap-4'>
                <Avatar
                    key={id}
                    size='xs'
                    src={picture}
                    alt='Your profile picture.'
                    fallback={name[0].toUpperCase()}
                />
                <Sidebar />
                <ThemeSwitch />
                <LogoutButton />
            </div>
        </header>
    )
}