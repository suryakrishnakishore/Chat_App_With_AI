import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useConversationStore } from '@/store/chat-store'

const GroupMemebersDailog = () => {
    const { selectedConversation } = useConversationStore();
    const users = selectedConversation?.participants || [];
  return (
    <div>
        <Dialog>
            <DialogTrigger>
                <p className='text-xs text-[hsl(var(--muted-foreground))]'>See Members</p>
            </DialogTrigger>
            <DialogContent>'
                <DialogHeader>
                    <DialogTitle className='my-2'>Group Memebers</DialogTitle>
                    <DialogDescription>
                        <div>
                            
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default GroupMemebersDailog