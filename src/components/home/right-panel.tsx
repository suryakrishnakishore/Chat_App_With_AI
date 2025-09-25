"use client";
import Image from 'next/image';
import React, { useState } from 'react'
import DesktopTcon from "../../../public/desktop-hero.png";

const RightPanel = () => {
  const [ panel, setPanel ] = useState(false);
  return (
    <div className='flex flex-col h-full w-full'>
      {panel ? (
        <div className=''>

        </div>
      ) : (
        <div className='flex items-center justify-center max-h-full'>
          <Image src={DesktopTcon} height={500} width={500} alt='Desktop Icon'/>
          <p className='text-[hsl(var(--gray-primary))]'>
            Welcome to ChatHub! Your AI-powered chat companion. Start a conversation by selecting or creating a new chat from the left panel.
          </p>
        </div>
      )}
    </div>
  )
}

export default RightPanel