import { Card, CardContent, CardHeader, CardTitle } from "@/components/supabase-ui/card";
import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({
    searchParams,
}: {
    searchParams: Promise<{ error: string }>;
}) {
    const params = await searchParams;

    return (
        <>
            {params?.error ? (
                <p className="text-sm text-muted-foreground">
                    Code error: {params.error}
                </p>
            ) : (
                <p className="text-sm text-muted-foreground">
                    An unspecified error occurred.
                </p>
            )}
        </>
    );
}

export default function Page({
    searchParams,
}: {
    searchParams: Promise<{ error: string }>;
}) {
    return (
        <div className="grow flex flex-col gap-6 w-full justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Sorry, something went wrong.
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense>
                        <ErrorContent searchParams={searchParams} />
                    </Suspense>
                </CardContent>
                <CardContent>
                    <Link href='/' className='block w-full interactive-btn text-center py-2 rounded-lg'>
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
