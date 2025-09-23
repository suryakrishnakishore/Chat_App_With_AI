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
            <DropdownMenuTrigger asChild className='relative bg-transparent'>
                <Button size={"icon"}>
                    <SunIcon className='h-[1.2rem] w-[1.2rem] rotatte-0 scale-100 transition-all dark:rotate-90 dark:scale-0' />
                    <MoonIcon className='h-[1.2rem] w-[1.2rem] absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle Theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-[hsl(var(--gray-primary))]'>
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeSwitch