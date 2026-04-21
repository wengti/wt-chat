"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/supabase-ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/supabase-ui/card";
import { Input } from "@/components/supabase-ui/input";
import { Label } from "@/components/supabase-ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FbBtn from "../oauth-components/FbBtn";
import GoogleBtn from "../oauth-components/GoogleBtn";

export type AuthErrorType = string | null

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<AuthErrorType>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            // Update this route to redirect to an authenticated route. The user already has an active session.
            router.push("/");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className='bg-card-white dark:bg-card-black'>

                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            {
                                error &&
                                <p className="text-sm text-red-500">{error}</p>
                            }
                            <Button type="submit" className={`w-full interactive-btn disabled:opacity-50`} disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/sign-up"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>

                        <div className='mt-4 text-sm text-center'>
                            <p>or continue with</p>
                        </div>
                        <div className='mt-2 flex gap-2'>
                            <div className='w-1/2'>
                                <FbBtn isLoading={isLoading} setIsLoading={setIsLoading} error={error} setError={setError} />
                            </div>
                            <div className='w-1/2'>
                                <GoogleBtn isLoading={isLoading} setIsLoading={setIsLoading} error={error} setError={setError} />
                            </div>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
