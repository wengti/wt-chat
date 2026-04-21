import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area"

export default function ChatRoom() {

    /* This message should be fetched */
    const messages = [
        {
            role: 'user',
            message: 'Tell me a good story'
        },
        {
            role: 'assistant',
            message: 'This is a story of blalabllblblbllablblalb alnfanf asnf kafnkwnafnwafnafsnk wa;nafn afnawf; wanfkwnafk naknskfnwankfn kanaknFWFPWF jennifersss lopez'
        },
        {
            role: 'user',
            message: 'Tell me a good story'
        },
        {
            role: 'assistant',
            message: 'This is a story of blalabllblblbllablblalb alnfanf asnf kafnkwnafnwafnafsnk wa;nafn afnawf; wanfkwnafk naknskfnwankfn kanaknFWFPWF APKFPASKFPWAFNANSF KANWFAPFASFALFAFLAAF'
        },
        {
            role: 'user',
            message: 'Tell me a good story'
        },
        {
            role: 'assistant',
            message: 'This is a story of blalabllblblbllablblalb alnfanf asnf kafnkwnafnwafnafsnk wa;nafn afnawf; wanfkwnafk naknskfnwankfn kanaknFWFPWF APKFPASKFPWAFNANSF KANWFAPFASFALFAFLAAF'
        },
        {
            role: 'user',
            message: 'Tell me a good story'
        },
        {
            role: 'assistant',
            message: 'This is a story of blalabllblblbllablblalb alnfanf asnf kafnkwnafnwafnafsnk wa;nafn afnawf; wanfkwnafk naknskfnwankfn kanaknFWFPWF APKFPASKFPWAFNANSF KANWFAPFASFALFAFLAAF'
        },
        {
            role: 'user',
            message: 'Tell me a good story'
        },{
            role: 'assistant',
            message: 'This is a story of blalabllblblbllablblalb alnfanf asnf kafnkwnafnwafnafsnk wa;nafn afnawf; wanfkwnafk naknskfnwankfn kanaknFWFPWF APKFPASKFPWAFNANSF KANWFAPFASFALFAFLAAF'
        },
        {
            role: 'user',
            message: 'Tell me a good story'
        },
        
    ]

    return (
        <ScrollArea className='h-(--chat-room-tall) md:w-11/12 pr-4 mx-auto flex flex-col'>
            <ScrollAreaViewport className='grow flex flex-col'>
                <div className='grow flex flex-col gap-4 justify-end'>
                    {
                        messages.map((messageObj, idx) => {
                            const { role, message } = messageObj
                            let messageCls = ''
                            if (role === 'assistant') {
                                messageCls = 'bg-icon-green mr-auto'
                            }
                            else if (role === 'user') {
                                messageCls = 'bg-card-white dark:bg-card-black ml-auto'
                            }
                            return (
                                <div
                                    key={idx}
                                    className={`${messageCls} min-h-10 p-2 max-w-3/4 border border-letter-black dark:border-letter-white rounded-md wrap-break-word`}
                                >
                                    {messageObj.message}
                                </div>
                            )
                        })
                    }
                </div>
            </ScrollAreaViewport>
            <ScrollBar orientation='vertical'/>
        </ScrollArea>
    )
}