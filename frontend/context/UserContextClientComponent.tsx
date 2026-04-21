'use client'
import React, { createContext } from "react";
import { userContextType } from "./UserContextServerComponent";

/* Type */
type userContextClientProviderPropsType = userContextType & {children: React.ReactNode}
export const UserContext = createContext<userContextType>(null!)

export default function UserContextClientProvider({children, id, name, email, picture}: userContextClientProviderPropsType){

    return (
        <UserContext value={{id, name, email, picture}}>
            {children}
        </UserContext>
    )
}