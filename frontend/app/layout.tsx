import ThemeContextProvider from '@/context/ThemeContextProvider';
import './globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

export const metadata: Metadata = {
    title: "wt-chat",
    description: "The site that allows you to chat with multiple different llm chat providers.",
};

const geist = Geist({
    subsets: ['latin']
})

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {


    return (
        <html lang="en" suppressHydrationWarning className={geist.className}>
            <ThemeContextProvider>
                    {children}
            </ThemeContextProvider>
        </html>
    );
}
