import React from "react"
import UserContextClientProvider from "./UserContextClientComponent"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type userContextType = {
    id: string
    name: string
    email: string
    picture: string
}

export default async function UserContextServerProvider({ children }: { children: React.ReactNode }) {

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('users')
            .select(`id, name, email, picture`)
        
        
        if (error) throw new Error(error.message)
        else if (data === null || data.length === 0) throw new Error("Cannot retrieve the current user's profile data.")
        const {id, name, email, picture} = data[0]

        return (
            <UserContextClientProvider id={id} name={name} email={email} picture={picture}>
                {children}
            </UserContextClientProvider>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}