import React, { useState } from 'react';
import Role from '../common/role';
import { IoMdClose } from "react-icons/io";
import { Sumana } from 'next/font/google';
import SummaryApi from '@/common';
import { toast } from 'react-toastify';

const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFuntion,
}) => {

    const [userRole,setUserRole] = useState(role)

    const handleOnChangeSelect= (e) =>{

        setUserRole(e.target.value)
 
    }
    const updateUserRole = async ()=> {
        const fetchResponse = await fetch(SummaryApi.updateUser.url,{
            method : SummaryApi.updateUser.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                role : userRole,
                userId : userId
            })
        })

        const resData = await fetchResponse.json()
        
        if(resData.success){
            toast.success(resData.message, {
                                        autoClose: 500, 
                                    });
            onClose()
            callFuntion()
        }

    }
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        {/* Close Button */}
        <button className="ml-auto block text-gray-600 hover:text-white hover:bg-red-500 p-2 rounded-full"
                onClick={onClose}        
        >
          <IoMdClose size={20} />
        </button>

        {/* Title */}
        <h1 className="pb-4 text-xl font-semibold text-center">Change User Role</h1>

        {/* User Info */}
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Name:</span> {name}</p>
          <p><span className="font-semibold">Email:</span> {email}</p>
        </div>

        {/* Role Selection */}
        <div className="flex items-center justify-between my-4">
          <p className="font-medium text-gray-700">Role:</p>
          <select className="border border-gray-300 px-4 py-1 rounded-md focus:ring focus:ring-blue-300 transition"
                  value={userRole}
                  onChange={handleOnChangeSelect}
          >
            {Object.values(Role).map((el, index) => (
              <option value={el} key={index}>{el}</option>
            ))}
          </select>
        </div>

        {/* Change Role Button */}
        <button className="w-full py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                onClick={updateUserRole}
        >
          Change Role
        </button>
      </div>
    </div>
  );
};

export default ChangeUserRole;
