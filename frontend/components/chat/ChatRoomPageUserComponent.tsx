'use client'
import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatRoom from "./ChatRoom";
import { ChatDataType } from "./ChatRoomPageServerComponent";



export default function ChatRoomPageUserComponent({chatData, convId}: {chatData: ChatDataType[], convId: string}) {

    /* Initialize the state data using props - afterwards it becomes a self-maintained state */
    const [chatRecord, setChatRecord] = useState<ChatDataType[]>(chatData)


    return (
        <>
            <ChatRoom chatRecord={chatRecord} />
            <ChatInput isNewConversation={false} convId={convId} chatRecord={chatRecord} setChatRecord={setChatRecord}/>
        </>
    )
}