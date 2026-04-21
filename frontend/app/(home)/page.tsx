import ChatInput from "@/components/chat/ChatInput";
import Greeting from "@/components/home/Greeting";


export default async function Home() {



    return (
        <>
            <div className='grow flex flex-col gap-8 justify-center'>
                <Greeting />
                <ChatInput isNewConversation={true} />
            </div>
        </>
    )
}
