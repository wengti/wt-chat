import ChatInput from "@/components/chat/ChatInput";
import Greeting from "@/components/home/Greeting";
import { v4 as uuidv4 } from 'uuid'

export default async function Home() {


    return (
        <>
            <div className='grow flex flex-col gap-8 justify-center'>
                <Greeting />
                <ChatInput isNewConversation={true} convId={null} chatRecord={[]} setChatRecord={null} />
            </div>
        </>
    )
}
