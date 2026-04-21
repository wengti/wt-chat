import Footer from "@/components/footers/Footer";
import AuthHeader from "@/components/headers/AuthHeader";
import AuthLogo from "@/components/logos/AuthLogo";
import UserContextServerProvider from "@/context/UserContextServerComponent";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <AuthHeader />
            <main className='flex flex-col min-h-(--content-min-y) px-(--content-space-x) py-(--content-space-y)'>
                <div className="grow flex flex-col w-full items-center justify-center">
                    <div className="w-full max-w-sm flex flex-col gap-4">
                        <AuthLogo />
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}