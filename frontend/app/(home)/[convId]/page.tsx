import ChatRoomPageServerComponent from "@/components/chat/ChatRoomPageServerComponent"
import { redirect } from "next/navigation"

export default async function ConversationPage({ params }: { params: Promise<{ convId: string }> }) {

    try {
        const { convId } = await params

        return (
            <ChatRoomPageServerComponent convId={convId} />
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/error?error=${error.message}`)
        else redirect(`/error`)
    }


}