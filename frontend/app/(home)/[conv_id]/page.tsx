import ChatInput from "@/components/chat/ChatInput"
import ChatRoom from "@/components/chat/ChatRoom"

export default async function ConversationPage({ params }: { params: Promise<{ conv_id: string }> }) {

    const { conv_id } = await params

    return (
        <>
            <ChatRoom />
            <ChatInput isNewConversation={false} />
        </>
    )
}