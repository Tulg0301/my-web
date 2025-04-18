"use client"
import SummaryApi from '@/common'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import moment from "moment"
import { MdEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '@/components/ChangeUserRole'

const page = () => {

  const[allUser, setAllUser] = useState([])
  const [openUpdateRole,setopenUpdataRole] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState({
    email : "",
    name : "" ,
    role : "",
    _id : "",
  });

  const handleDelete = async (id) => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "DELETE",
          credentials: "include"
        });
        const resData = await res.json();
        if (resData.success) {
          toast.success(resData.message);
          setShowConfirm(false);
          fetchAllUser(); 
        } else {
          toast.error("Lỗi khi xóa tài khoản.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối tới API");
      }
    };

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
                  <div className='flex items-center justify-start gap-2'>
                    <button
                      className={`p-2 rounded-full transition ${
                        el?.role === 'ADMIN' 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-green-200 hover:bg-green-400 cursor-pointer'
                      }`}
                      disabled={el?.role === 'ADMIN'}
                      onClick={() => {
                        if (el?.role !== 'ADMIN') {
                          setopenUpdataRole(true);
                          setSelectedUser(el);
                        }
                      }}
                    > 
                      <MdEdit />
                    </button>

                    <button 
                      className={`p-2 rounded-full text-white shadow-md transition duration-300 ${
                        el?.role === 'ADMIN'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                      }`}
                      disabled={el?.role === 'ADMIN'}
                      onClick={() => {
                        if (el?.role !== 'ADMIN') {
                          setShowConfirm(true);
                          setSelectedDelete(el);
                        }
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
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

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
            <p className="mt-4 text-gray-600">Bạn có chắc chắn muốn xóa tài khoản này không?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDelete(selectedDelete?._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  )
}

export default page
