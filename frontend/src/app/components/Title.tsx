import React from 'react'

function Title({text}: {text: string}) {
  return (
    <div className="w-full flex flex-col space-y-3">
        <h1 className='text-4xl font-extralight'>
            {text}
        </h1>
        <div className="w-full h-[2px] bg-deep-blue"></div>
    </div>
  )
}

export default Title