'use client'
import { createClient } from "@/lib/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { FaFacebook } from "react-icons/fa";
import { AuthErrorType } from "../supabase-components/login-form";
import clsx from "clsx";

type AuthBtnPropsType = {
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
    error: AuthErrorType
    setError: Dispatch<SetStateAction<AuthErrorType>>
}

export default function GoogleBtn({ isLoading, setIsLoading, error, setError }: AuthBtnPropsType) {

    const btnClass = clsx({
        'w-full flex gap-2 items-center justify-center bg-[#1877F2] py-1 rounded-lg font-semibold text-letter-white disabled:opacity-50': true,
    })

    async function handleLogin() {
        try {
            setIsLoading(true)
            const supabase = createClient()

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/callback` /* add ?next=/protected to redirect to somewhere else i.e. /protected */
                }
            })
            if (error) throw new Error(error.message)
            setError(null)

        }
        catch (error) {
            setIsLoading(false)
            if (error instanceof Error) setError(error.message)
            else setError('Unknown error is found in logging in with Google.')
        }
    }

    return (
        <button
            className={btnClass}
            onClick={() => handleLogin()}
            type='button'
            disabled={isLoading}
        >
            <FaFacebook />
            <p>Facebook</p>
        </button>
    )
}
