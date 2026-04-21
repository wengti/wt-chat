'use client'
import { UpdatePasswordForm } from "@/components/supabase-components/update-password-form";
import { usePathname } from "next/navigation";

export default function Page() {
    const pathname = usePathname()
    return (
        <UpdatePasswordForm key={pathname}/>
    );
}
