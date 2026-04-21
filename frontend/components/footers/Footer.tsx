'use client'

export default function Footer(){
    const now = new Date()
    const year = now.getFullYear()

    return (
        <footer className='h-(--footer-y) flex flex-col justify-center items-center text-semibold text-letter-black dark:text-letter-white bg-card-white dark:bg-card-black'>
            <p>Weng Ti Wong @ {year}</p>
        </footer>
    )
}