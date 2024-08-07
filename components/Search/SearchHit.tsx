import * as React from 'react'
import { Highlight, Snippet } from 'react-instantsearch'

function Hit({ hit }) {
    return (
        <article className="hit">
            <h1>
                <Snippet hit={hit} attribute="name" className='font-bold text-white' />
            </h1>
            <h1 className="text-white font-light dark:text-gray-400 text-xs mt-2">
                {hit.publisher_id}
            </h1>
           <div className='flex flex-row justify-start mt-5 items-center'>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
            </svg>
            <h1 className="font-semibold text-white dark:text-gray-400 text-sm">
            {hit.total_install}
            </h1>
           </div>
        </article>
    )
}

export default Hit
