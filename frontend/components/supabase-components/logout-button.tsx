"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/supabase-ui/button";
import { useRouter } from "next/navigation";
import { FaDoorOpen } from "react-icons/fa";

export function LogoutButton() {


    const router = useRouter();

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    return (
        <button onClick={logout} className='text-letter-black dark:text-letter-white text-2xl hover:text-hover-green active:text-hover-green'>
            <FaDoorOpen />
        </button>
    )
}
