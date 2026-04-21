import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger } from "../tailgrids/core/sheet";
import { BiSolidConversation } from "react-icons/bi";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {

    return (
        <Sheet>
            <SheetTrigger className='text-2xl hover:text-hover-green'>
                <BiSolidConversation />
            </SheetTrigger>
            <SheetOverlay>
                <SheetContent side="right">
                    {({ close }) => (
                        <>
                            <SheetHeader>
                                <SheetTitle>History</SheetTitle>
                            </SheetHeader>
                            <SheetBody>
                                <SidebarContent onClose={close} />
                            </SheetBody>
                            <SheetFooter showCloseButton />
                        </>
                    )}
                </SheetContent>
            </SheetOverlay>
        </Sheet>
    )
}