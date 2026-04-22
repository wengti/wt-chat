import { redirect } from "next/navigation"
import ChatInput from "./ChatInput"
import ChatRoom from "./ChatRoom"
import { createClient } from "@/lib/supabase/server"
import ChatRoomPageUserComponent from "./ChatRoomPageUserComponent"


export type ChatDataType = {
    id?: string
    created_at: Date
    conversation_id: string
    user_id: string
    role: 'user' | 'model'
    message: string
}

export default async function ChatRoomPageServerComponent({ convId }: { convId: string }) {

    try {

        /* Fetch conversation metadata */
        /* If no result is returned, direct user to error page - either not exist or user does not have access*/
        const supabase = await createClient()
        const { data: conversationData, error: conversationDataError } = await supabase
            .from('conversations')
            .select(`
                id, user_id, title
                `)
            .eq('id', convId)
        if (conversationDataError) throw new Error(conversationDataError.message)
        else if (conversationData === null || conversationData.length === 0) throw new Error('This conversation does not exist.')

        const { data: fetchedChatData, error: chatDataError } = await supabase
            .from('messages')
            .select(`
                id, created_at, conversation_id, user_id, role, message
                `)
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true })
        if (chatDataError) throw new Error(chatDataError.message)
        else if (fetchedChatData === null) throw new Error('No valid messages can be retrieved for this conversation.')
        const chatData = fetchedChatData.map((data) => {
            return {
                ...data,
                created_at: new Date(data.created_at)
            }
        }) as ChatDataType[]



        return (
            <ChatRoomPageUserComponent chatData={chatData} convId={convId} />
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/error?error=${error.message}`)
        else redirect(`/error`)
    }
}