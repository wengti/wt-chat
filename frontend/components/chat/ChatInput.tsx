'use client'

import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { Label } from "../tailgrids/core/label"
import { TextArea } from "../tailgrids/core/text-area"
import { Toggle } from "../tailgrids/core/toggle"
import { IoMdSend } from "react-icons/io";
import { motion } from 'motion/react'
import { ChatDataType } from "./ChatRoomPageServerComponent"
import { UserContext } from "@/context/UserContextClientComponent"
import { createClient } from "@/lib/supabase/client"
import { Spinner } from "../tailgrids/core"
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from "next/navigation"


export type ChatInputPropsType = {
    isNewConversation: boolean
    convId: string | null
    chatRecord: ChatDataType[]
    setChatRecord: Dispatch<SetStateAction<ChatDataType[]>> | null
}

export default function ChatInput({ isNewConversation, convId, chatRecord, setChatRecord }: ChatInputPropsType) {

    const [message, setMessage] = useState<string>('')
    const [isGemini, setIsGemini] = useState<boolean>(true) /* If not Gemini, then its GPT */
    const [isSerious, setIsSerious] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { id: userId } = useContext(UserContext)

    const bottomRef = useRef<HTMLDivElement>(null!)

    const router = useRouter()

    useEffect(() => {
        const id = setTimeout(() => {
            bottomRef.current.scrollIntoView({
                behavior: 'smooth'
            })
        }, 1000)
        return () => { clearTimeout(id) }

    }, [chatRecord])


    /* Connect to API */
    async function handleSubmit() {

        try {
            if (message === '') {
                throw new Error('No input message.')
            }

            if (!isNewConversation) {
                setMessage('')
            }

            setIsLoading(true)
            setError(null)

            /* Preparing data to be sent */
            /* Update the internal state for display */
            if (setChatRecord && convId) {
                setChatRecord((prevChatRecord) => {
                    const newChatRecord = structuredClone(prevChatRecord)
                    newChatRecord.push({
                        created_at: new Date(),
                        conversation_id: convId,
                        user_id: userId,
                        role: 'user',
                        message: message
                    })
                    return newChatRecord
                })
            }

            /* Set the data to be sent to AI */
            const chatRecordToAI = chatRecord.map((record) => {
                return {
                    role: record.role,
                    message: record.message
                }
            })


            const model_name = isGemini ? 'gemini' : 'gpt'
            const baseURLStr = process.env.NEXT_PUBLIC_API_URL

            /* Past conversation should be from above a level which houses the conversations and chat inputs */
            /* Use past conversation + current messages */

            /* Send messages to the backend */
            const res = await fetch(`${baseURLStr}/chat`, {
                method: 'POST',
                body: JSON.stringify({
                    user_prompt: message,
                    history: chatRecordToAI,
                    is_serious: isSerious,
                    is_new_conversation: isNewConversation,
                    model_name: model_name
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) {
                const responseData = await res.json()
                throw new Error(responseData.detail)
            }

            if (!res.body) {
                throw new Error('Unable to retrieve the body of the response in generating a message.')
            }

            /* Add an empty placeholder to store the streamed chunk */
            if (setChatRecord && convId) {
                setChatRecord((prevChatRecord) => {
                    const newChatRecord = structuredClone(prevChatRecord)
                    newChatRecord.push({
                        created_at: new Date(),
                        conversation_id: convId,
                        user_id: userId,
                        role: 'model',
                        message: ''
                    })
                    return newChatRecord
                })
            }


            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let response_message = ''
            while (true) {
                const { done, value } = await reader.read()
                if (done) break /* Final value is undefined therefore must be checked first before proceeding*/

                const response_chunk = decoder.decode(value, { stream: true })
                response_message += response_chunk

                /* Receive the data */
                /* Update the internal state for display */
                if (setChatRecord && convId) {
                    setChatRecord((prevChatRecord) => {
                        const newChatRecord = structuredClone(prevChatRecord)
                        newChatRecord[newChatRecord.length - 1].message = response_message
                        return newChatRecord
                    })
                }

                /* Delay to slowly streamout the response */
                if (!isNewConversation) {
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve("")
                        }, 30)
                    })
                }


            }



            /* Once reaches here: consider the conversation cycle is completed */
            /* Finally then update the database */
            const supabase = createClient()
            if (!isNewConversation) {
                const { error: dbError } = await supabase
                    .from('messages')
                    .insert([
                        { conversation_id: convId, user_id: userId, role: 'user', message: message },
                        { conversation_id: convId, user_id: userId, role: 'model', message: response_message }
                    ])
                if (dbError) throw new Error(dbError.message)
            }
            else if (isNewConversation && !convId) {


                const titleResponse = await fetch(`${baseURLStr}/title`, {
                    method: 'POST',
                    body: JSON.stringify({
                        prompt: message,
                        model_name: model_name
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const generatedTitleData = await titleResponse.json()
                if (!titleResponse.ok) throw new Error('Encountered difficulties in generating title for this conversation.')


                setMessage('')
                const generatedConvId = uuidv4()
                const { error: convError } = await supabase
                    .from('conversations')
                    .insert({
                        id: generatedConvId, user_id: userId, title: generatedTitleData.title
                    })
                if (convError) throw new Error(convError.message)

                const { error: dbError } = await supabase
                    .from('messages')
                    .insert([
                        { conversation_id: generatedConvId, user_id: userId, role: 'user', message: message },
                        { conversation_id: generatedConvId, user_id: userId, role: 'model', message: response_message }
                    ])
                if (dbError) throw new Error(dbError.message)

                router.push(`/${generatedConvId}`)

            }

            setIsLoading(false)
        }

        catch (error) {
            setIsLoading(false)
            if (error instanceof Error) setError(error.message)
            else setError('An unknown error occured when trying to send a message.')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className={`w-11/12 h-(--chat-input-tall) mx-auto flex flex-col justify-center gap-2 bg-background-white dark:bg-background-black pt-4`}
        >

            {/* Error */}
            {
                error &&
                <div className='text-red-500 text-sm'>
                    {error}
                </div>
            }

            {/* Options */}
            <div className='flex justify-between sm:justify-end sm:gap-8'>
                {/* Model Selection */}
                <div className="flex gap-2 items-center">
                    <Label htmlFor="model" className="hidden">
                        Enable Chat GPT or Gemini
                    </Label>
                    <span className='text-xs'>ChatGPT</span>
                    <Toggle
                        name='model'
                        checked={isGemini}
                        onChange={(event) => setIsGemini(event.target.checked)}
                        disabled={isLoading}
                    />
                    <span className='text-xs'>Gemini</span>
                </div>

                {/* Mode Selection */}
                <div className="flex gap-2 items-center">
                    <Label htmlFor="mode" className="hidden">
                        Model Replies in serious or playful manner
                    </Label>
                    <span className='text-xs'>Playful</span>
                    <Toggle
                        name='mode'
                        checked={isSerious}
                        onChange={(event) => setIsSerious(event.target.checked)}
                        disabled={isLoading}
                    />
                    <span className='text-xs'>Serious</span>
                </div>
            </div>

            {/* Text Area */}
            <div className='w-full'>
                <Label htmlFor="message" className="hidden">
                    Message
                </Label>
                <TextArea
                    name="message"
                    id="message"
                    placeholder="Ask me a question..."
                    value={message}
                    onChange={(event) => { setMessage(event.target.value) }}
                    className='bg-card-white dark:bg-card-black text-letter-black dark:text-letter-white resize-none field-sizing-content min-h-25 max-h-35 sm:min-h-20 sm:max-h-40'
                    disabled={isLoading}
                />
            </div>

            {/* Button */}
            <button
                className='flex gap-2 items-center bg-icon-green w-fit px-2 py-1 rounded-md ml-auto font-semibold interactive-btn disabled:cursor-not-allowed disabled:bg-hover-green'
                disabled={isLoading}
                onClick={() => handleSubmit()}
            >
                {
                    isLoading ?
                        <Spinner type="default" /> :
                        <>
                            <p>Send</p>
                            <IoMdSend />
                        </>
                }

            </button>
            <div ref={bottomRef}></div>
        </motion.div>
    )
}