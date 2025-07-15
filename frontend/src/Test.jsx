import React, { useState, useRef, useEffect } from 'react';

function AccordingItem({title,children,isOpen,onClick}){
    const contentRef = useRef(null);
    useEffect(()=>{
        const el = contentRef.current;
        if(!el) return ;

        if(isOpen){
            el.style.height = el.scrollHeight + 'px';
        }
        else{
            el.style.height = '0px';
        }
    },[isOpen])
    return (
        <div className=''>
            <button onClick={onClick}
            className='flex justify-between w-full px-4 py-3 items-center hover:bg-gray-50'
            >
                <span className='font-medium text-gray-800'>{title}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div 
                ref={contentRef}
                className='overflow-hidden transition-[height] duration-500 ease-in-out'
                style={{ height: '0px' }}
            >
                <div className='px-6 pb-4 pt-2 space-y-2 text-sm text-gray-700'>
                    {children}
                </div>
            </div>
        </div>
    )
}
export default function Test(){
    const [openSection,setOpenSection] = useState(null)
    const togglesection = (section)=>{
        setOpenSection(openSection === section ? null :section)
    }
    return(
        <div className='w-full max-w-sm mx-auto mt-10 bg-white border rounded shadow'>
            <AccordingItem
                title='laptop'
                isOpen={openSection ==='laptop'}
                onClick={() =>togglesection('laptop')}
            >
                <a href='#' className='block hover:text-blue-500'>asus</a>
                <a href='#' className='block hover:text-blue-500'>lenovo</a>
                <a href='#' className='block hover:text-blue-500'>acer</a>
                <a href='#' className='block hover:text-blue-500'>tuf</a>    
            </AccordingItem>
            <hr/>
            <AccordingItem
                title='phone'
                isOpen={openSection==='phone'}
                onClick={() => togglesection('phone')}
            >
                <a href='#' className='block hover:text-blue-500'>samsung</a>
                <a href='#' className='block hover:text-blue-500'>iphone</a>
                <a href='#' className='block hover:text-blue-500'>huawei</a>
                <a href='#' className='block hover:text-blue-500'>xiaomi</a>  

            </AccordingItem>
        </div>
        
    )
}