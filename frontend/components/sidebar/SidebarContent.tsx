import Link from "next/link"

export default function SidebarContent({ onClose }: { onClose: () => void }) {

    /* This content should be gotten from above Sidebar */
    const contentList = [
        {
            id: 0,
            title: 'Conversation about soccer'
        },
        {
            id: 1,
            title: 'Conversation about football'
        },
        {
            id: 2,
            title: 'Conversation about guitar'
        },
        {
            id: 3,
            title: 'Conversation about love'
        },
        {
            id: 4,
            title: 'Conversation about hate'
        },
        {
            id: 5,
            title: 'Conversation about anime'
        },
        {
            id: 6,
            title: 'Conversation about magic'
        },
        {
            id: 7,
            title: 'Conversation about board game'
        },
    ]

    return (
        <div>
            {
                contentList.map(item => {
                    return (
                        <Link
                            key={item.id}
                            href={`/${item.id}`}
                            onClick={onClose}
                            className='border-b border-letter-mute block px-2 py-2 hover:text-icon-green active:text-icon-green'
                        >
                            {item.title}
                        </Link>
                    )
                })
            }
        </div>
    )

}