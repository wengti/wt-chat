'use client'
import { UserContext } from "@/context/UserContextClientComponent"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { Skeleton } from "../tailgrids/core/skeleton"

export type ConversationContentType = {
    id: string
    title: string
}

export default function SidebarContent({ onClose }: { onClose: () => void }) {

    const { convId } = useParams<{ convId: string }>()
    const { id: userId } = useContext(UserContext)

    const [error, setError] = useState<string | null>(null)
    const [contentList, setContentList] = useState<ConversationContentType[]>([])
    const [hasFetch, setHasFetch] = useState<boolean>(false)


    useEffect(() => {

        async function fetchContentList() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('conversations')
                .select('id, title')
                .eq('user_id', userId)
            if (error) setError(error.message)
            if (data === null) setError('Unable to retrieve the past conversations.')
            setContentList(data as ConversationContentType[])
            setHasFetch(true)
        }

        fetchContentList()
        
    }, [])



    return (
        <div>
            {
                !hasFetch ?
                [0,1,2,3,4].map( i => {
                    return (
                        <Skeleton className="h-4 w-full mb-4" key={i}/>
                    )
                }) :
                error ?
                    <p className="text-red-500">{error}</p> :
                    contentList.length > 0 ?
                        contentList.map(item => {
                            const highlightCls = item.id === convId ? 'text-icon-green' : ''
                            return (
                                <Link
                                    key={item.id}
                                    href={`/${item.id}`}
                                    onClick={onClose}
                                    className={`border-b border-letter-mute block px-2 py-2 hover:text-icon-green active:text-icon-green ${highlightCls}`}
                                >
                                    {item.title}
                                </Link>
                            )
                        }) :
                        <p>There's no past conversation.</p>
            }
        </div>
    )

}