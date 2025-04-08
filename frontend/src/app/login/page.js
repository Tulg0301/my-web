"use client";
import SummaryApi from '@/common';
import { setUserDetail, setCartProductCount } from "@/store/userSlice";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const page = () => {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const [data,setData] = useState({
        email : "",
        password : ""

    })
    const handleOnchange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return{
                ...preve,
                [name] : value
            }
        })
    }
    const fetchUserAddToCart = async ()=>{
        const dataResponse = await fetch("http://localhost:8080/api/countaddtocart", {
          method: "GET",
          credentials: "include",
        });
        const dataApi = await dataResponse.json();
        dispatch(setCartProductCount(dataApi?.data?.count || 0));
      }
    const handleOnSubmit= async (e) => {
        e.preventDefault()

        const dataResponse = await fetch("http://localhost:8080/api/signin", {
            method: SummaryApi.signIn.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const dataAPI = await dataResponse.json()

        if(dataAPI.success){
            toast.success(dataAPI.message, {
                            autoClose: 500, // Thời gian hiển thị là 1 giây (1000ms)
                        });

            fetchUserDetails();
            fetchUserAddToCart()

            router.push("/");
        }
        if(dataAPI.error){
            toast.error(dataAPI.message)
        }
    }
    const fetchUserDetails = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/user-details", {
            method: "GET",
            credentials: "include",
          });
    
          const dataApi = await response.json();
    
          if(dataApi.success){
            dispatch(setUserDetail(dataApi.data))
          }
          
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
    };

  return (
    <section id='login'>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 bg-[#88CDF6] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>
        
                <form className="space-y-4" onSubmit={handleOnSubmit}>
                <div>
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input 
                    type="email"
                    name="email" 
                    value={data.email}
                    onChange={handleOnchange}
                    placeholder="Nhập email của bạn" 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">Mật khẩu</label>
                    <div className='relative'>
                        <input 
                        type={showPassword ? "text" : "password" }
                        name='password'
                        value={data.password}
                        onChange={handleOnchange}
                        placeholder="Nhập mật khẩu" 
                        className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                              onClick={()=>setShowPassword((preve)=>!preve)}
                        >
                            {
                                showPassword ? (
                                    <FaEyeSlash/>
                                )
                                :
                                (
                                    <FaEye/>
                                )
                            }
                
                        </span>
                    </div>
                 </div>

                <div className="flex justify-between items-center">
                    <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Ghi nhớ tôi
                    </label>
                    <a href="forgot-password" className="text-blue-500 hover:underline">Quên mật khẩu?</a>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300"
                >
                    Đăng nhập
                </button>
                </form>

        <p className="mt-6 text-center text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">Đăng ký ngay</a>
        </p>
      </div>
    </div>

    </section>
  )
}

export default page
