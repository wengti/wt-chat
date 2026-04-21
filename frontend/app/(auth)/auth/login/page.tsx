'use client'
import { LoginForm } from "@/components/supabase-components/login-form";
import { usePathname } from "next/navigation";

export default function Page() {
    const pathname = usePathname()

    return (
        <LoginForm key={pathname}/>
    );
}
