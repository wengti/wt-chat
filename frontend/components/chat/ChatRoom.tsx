import { useEffect, useRef } from "react"
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area"
import { ChatDataType } from "./ChatRoomPageServerComponent"

export default function ChatRoom({chatRecord}: {chatRecord: ChatDataType[]}) {

    const bottomRef = useRef<HTMLDivElement>(null!)

    useEffect( () => {
        bottomRef.current.scrollIntoView({
            behavior: 'smooth'
        })
    }, [chatRecord])

    /* This message should be fetched */
    return (
        <ScrollArea className='h-(--chat-room-tall) w-full md:w-11/12 pr-4 mx-auto flex flex-col z-1'>
            <ScrollAreaViewport className='grow flex flex-col'>
                <div className='grow flex flex-col gap-4 justify-end'>
                    {
                        chatRecord.length > 0 ?
                        chatRecord.map((chatRecordObj, idx) => {
                            const { role, message } = chatRecordObj
                            let messageCls = ''
                            if (role === 'model') {
                                messageCls = 'bg-icon-green mr-auto text-letter-white'
                            }
                            else if (role === 'user') {
                                messageCls = 'bg-card-white dark:bg-card-black ml-auto'
                            }
                            return (
                                <div
                                    key={idx}
                                    className={`${messageCls} min-h-10 p-2 max-w-3/4 border border-letter-black dark:border-letter-white rounded-md wrap-break-word whitespace-pre-wrap`}
                                >
                                    {message}
                                </div>
                            )
                        }):
                        <div className='text-letter-mute mb-auto'>
                            No messages.
                        </div>
                    }
                </div>
                <div ref={bottomRef}></div>
            </ScrollAreaViewport>
            <ScrollBar orientation='vertical'/>
        </ScrollArea>
    )
}