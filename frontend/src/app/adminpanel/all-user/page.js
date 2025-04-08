"use client"
import SummaryApi from '@/common'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import moment from "moment"
import { MdEdit } from "react-icons/md";
import ChangeUserRole from '@/components/ChangeUserRole'

const page = () => {

  const[allUser, setAllUser] = useState([])
  const [openUpdateRole,setopenUpdataRole] = useState(false)
  const [selectedUser, setSelectedUser] = useState({
    email : "",
    name : "" ,
    role : "",
    _id : "",
  });


  const fetchAllUser = async ()=>{
      const fetchData = await fetch(SummaryApi.allUser.url,{
        method : SummaryApi.allUser.method,
        credentials : "include"
      })

      const dataRes = await fetchData.json()
      if(dataRes.success){
        setAllUser(dataRes.data)
      }

      if(dataRes.error){
        toast.error(dataRes.message)
      }
      console.log(dataRes)
  }
  useEffect(()=>{
      fetchAllUser()
  },[])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 border-b rounded-sm">
              <th className="px-4 py-3 text-left text-white font-semibold">Sr</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Created date</th>
              <th className="px-4 py-3 text-left text-white font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((el, index) => (
              <tr key={el._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{el?.name}</td>
                <td className="px-4 py-3">{el?.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-sm rounded-lg font-medium 
                    ${el?.role === 'ADMIN' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                    {el?.role}
                  </span>
                </td>
                <td className="px-4 py-3">{moment(el?.createdAt).format('DD-MM-YYYY')}</td>
                <td className='px-4 py-3'>
                  <button className='bg-green-200 p-2 rounded-full cursor-pointer hover:bg-green-400'
                          onClick={() => {
                            setopenUpdataRole(true),
                            setSelectedUser(el)
                          }}
                  > 
                    <MdEdit/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {
          openUpdateRole && (
            <ChangeUserRole onClose={() => {
              setopenUpdataRole(false)
            }}
            name = {selectedUser.name}
            email = {selectedUser.email}
            role = {selectedUser.role}
            userId = {selectedUser._id}
            callFuntion={fetchAllUser}
            
            />
          )
        }
        
</div>

  )
}

export default page
