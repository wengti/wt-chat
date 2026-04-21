'use client'

import { useState } from "react"
import { Label } from "../tailgrids/core/label"
import { TextArea } from "../tailgrids/core/text-area"
import { Toggle } from "../tailgrids/core/toggle"
import { IoMdSend } from "react-icons/io";
import { motion } from 'motion/react'


export default function ChatInput({ isNewConversation }: { isNewConversation: boolean }) {


    const [pastMessages, setPastMessages] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [isGemini, setIsGemini] = useState<boolean>(true) /* If not Gemini, then its GPT */
    const [isSerious, setIsSerious] = useState<boolean>(true)



    /* Connect to API */
    function handleSubmit() {

        if (isNewConversation) {
            /* Hit new api to generate a title for this conversation */

            /* redirect the user to a new page */
        }
        else {
            /* Past conversation should be from above a level which houses the conversations and chat inputs */
            /* Use past conversation + current messages */

            /* Send messages to the backend */

            /* Wait for response */

            /* Add the streamed response to the conversations state */
            /* Backend should also update the database */

            /* Rerender */
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
                />
            </div>

            {/* Button */}
            <button
                className='flex gap-2 items-center bg-icon-green w-fit px-2 py-1 rounded-md ml-auto font-semibold interactive-btn'
                onClick={() => handleSubmit()}
            >
                <p>Send</p>
                <IoMdSend />
            </button>
        </motion.div>
    )
}