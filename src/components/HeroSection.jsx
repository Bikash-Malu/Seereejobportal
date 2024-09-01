import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 IT training institute</span>
                <h1 className='text-3xl md:text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-blue-600'>Dream Jobs</span></h1>
                <p>seeree is one of the best IT training institutes and Software industry.</p>
                <div className='flex w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full px-2 py-2 rounded-l-full'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-blue-600 px-4 py-2">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;
