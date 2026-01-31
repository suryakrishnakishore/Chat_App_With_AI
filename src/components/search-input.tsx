import { ListFilter, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import api from '@/lib/apiCalls';

function SearchInput({ searchedConversations, setSearchedConversations }: any) {
    const [inputVal, setInputVal] = useState("");

    function handleChange(e: any) {
        setInputVal(e.target.value);
    }
    // console.log("Input Val: ", inputVal);

    async function handleSearchUsers() {
        const res = await api.get(`/api/user/get-profile/${inputVal}`);
        // console.log("Search result: ", res);
        setSearchedConversations(res.data.searchedUsers);

    }

    useEffect(() => {
        if (!inputVal || inputVal.length < 3) {
            setSearchedConversations([]);
            return;
        }
        handleSearchUsers();
    }, [inputVal]);

    return (
        <div className="p-3 flex items-center">
            <Search size={20} className="absolute m-2 text-gray-400" />
            <Input
                type="text"
                placeholder="Search or start new chat"
                value={inputVal}
                onChange={handleChange}
                className="pl-8 py-2 text-sm bg-[hsl(var(--gray-primary))] text-gray-300 border-0"
            />
            <ListFilter className="cursor-pointer ml-2" />
        </div>
    )
}

export default SearchInput