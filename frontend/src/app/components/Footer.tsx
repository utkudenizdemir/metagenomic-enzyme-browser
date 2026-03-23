import React from 'react'
import { FaRegCopyright } from 'react-icons/fa'

function Footer() {
  return (
    <div className='flex justify-between flex-row text-center w-full p-3 bg-light-blue text-deep-blue font-bold'>
      <div>
        Website by Insiligence Limited.
      </div>
      <div className='flex justify-center items-center space-x-1'>
      
      <FaRegCopyright /> 
      <p>2025 Prozomix Limited.</p>
      </div>
    </div>
  )
}

export default Footer