import Image from 'next/image'
import React from 'react'
import UserImage from '../../../public/placeholder.png'
import { Button } from '../ui/button'
import { CgDarkMode } from "react-icons/cg";
import ThemeSwitch from '../theme-switch';
import { ListFilter, LogOut, MessageSquareDiff, Search, User } from 'lucide-react';
import { Input } from '../ui/input';
import Conversations from '../conversations';
import { conversations } from '@/dummyData/db';

const LeftPanel = () => {

  return (
    <div className='flex flex-col h-full border-gray-600 w-1/4 border-r'>
      <div className='sticky top-0 bg-[hsl(var(--left-panel))] z-10'>
        <div className='flex bg-[hsl(var(--gray-primary))] items-center justify-between'>
          {/* <Image src={UserImage} alt="User Avatar" width={40} height={40} className='rouunded-full m-2'/>
           */}
          <User className='rounded-full m-2' size={22}/>
          <div className='flex h-full items-center p-3 gap-3'>
            <MessageSquareDiff size={20} />
            <ThemeSwitch />
            <LogOut size={20} />
          </div>
        </div>

        <div className='p-3 flex items-center'>
          <Search size={20} className='absolute m-2 text-gray-400' />
          <Input
            type='text'
            placeholder='Search or start new chat'
            className='focus:ring-0 !bg-[hsl(var(--gray-primary))] text-gray-400 border-0 py-2 pl-8 text-sm mr-2 shadow-sm'
          />
          <ListFilter className='cursor-pointer' />
        </div>
      </div>

      <div className='overflow-auto flex flex-col max-h-[89%] gap-0 my-3'>
            {conversations?.map((conversation) => (
              <Conversations key={conversation._id} conversation={conversation}/>
            ))}
          {conversations?.length === 0 && (
            <div>
              <p className='text-center text-gray-500 text-sm mt-2'>No Conversations</p>
              <p className='text-center text-gray-500 text-sm mt-2'>
                We understand {"you're"} an introvert, but you need to start somewhere
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

export default LeftPanel