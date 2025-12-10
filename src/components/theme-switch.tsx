"use client";

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

const ThemeSwitch = () => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className='relative bg-transparent cursor-pointer'>
                <Button size={"icon"}>
                    <SunIcon className='h-[1.2rem] w-[1.2rem] rotatte-0 scale-100 transition-all dark:rotate-90 dark:scale-0' />
                    <MoonIcon className='h-[1.2rem] w-[1.2rem] absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle Theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-[hsl(var(--gray-primary))] border-gray-600'>
                <DropdownMenuItem onClick={() => setTheme("light")} className='cursor-pointer hover:bg-gray-900'>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className='cursor-pointer hover:bg-[hsl(var(--gray-secondary))]'>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className='cursor-pointer hover:bg-[hsl(var(--gray-secondary))]'>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch