import Footer from "@/components/footers/Footer";
import HomeHeader from "@/components/headers/HomeHeader";
import UserContextServerProvider from "@/context/UserContextServerComponent";
import React from "react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {

    return (
        <UserContextServerProvider>
            <HomeHeader />
            <main className='flex flex-col min-h-(--content-min-y) px-(--content-space-x) py-(--content-space-y)'>
                <div className="grow flex flex-col w-full gap-(--main-gap-tall)">
                    {children}
                </div>
            </main>
            <Footer />
        </UserContextServerProvider>
    )
}