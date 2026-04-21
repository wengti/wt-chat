'use client'
import { SignUpForm } from "@/components/supabase-components/sign-up-form";
import { usePathname } from "next/navigation";

export default function Page() {
    const pathname = usePathname()
    return (
        <SignUpForm key={pathname}/>
    );
}
