import React from 'react'
import { IoMdClose } from "react-icons/io"

const DisplayImage = ({
    imgUrl,
    onClose,
}) => {
  return (
    <div className='fixed bottom-0 top-0 right-0 left-0 flex justify-center items-center backdrop-blur-none bg-black/30'>
        <div className='bg-white shadow-lg rounded mx-auto max-w-5xl px-2 py-2'>
            <button className="ml-auto block text-gray-600 hover:text-white hover:bg-red-500 p-1 rounded-full"
                                        onClick={onClose}        
                                >
                                  <IoMdClose size={20} />
            </button>
            <div className='flex justify-items-center p-4 pt-1 max-w-[80vh] max-h-[80vh]'>
                <img src={imgUrl} className='w-full max-h-[80vh] '></img>
            </div>
        </div>
    </div>
  )
}

export default DisplayImage
