"use client";
import SummaryApi from '@/common';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';

const Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const router = useRouter()

    // Khởi tạo state với chuỗi rỗng, không undefined
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: ""
    });
    
    

    // Hàm xử lý thay đổi input
    const handleOnchange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value || ""   // Đảm bảo không undefined
        }));
    };

    // Hàm xử lý khi submit
    const handleOnSubmit = async (e) => {
        e.preventDefault();


        if (data.password == data.confirmPassword) {

            const dataReponsive = await fetch(SummaryApi.signUp.url,{
                method : SummaryApi.signUp.method,
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify(data)
            })
    
            const dataApi = await dataReponsive.json()

            if(dataApi.success){
                toast.success(dataApi.message)
                router.push("/login")
            }
            if(dataApi.error){
                toast.error(dataApi.message)
            }

            }else{
                toast.error("Mật khẩu nhập lại chưa khớp")
            }
    };

    return (
        <section id='signup'>
            <div className="min-h-screen bg-gradient-to-r from-blue-500 bg-[#88CDF6] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng ký</h2>

                    <form className="space-y-4" onSubmit={handleOnSubmit}>
                        <div>
                            <label className="block text-gray-600 mb-1">Nhập tên đăng ký</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name || ""}
                                onChange={handleOnchange}
                                required
                                placeholder="Nhập tên"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email || ""}
                                onChange={handleOnchange}
                                required
                                placeholder="Nhập email của bạn"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Mật khẩu</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password || ""}
                                    onChange={handleOnchange}
                                    required
                                    placeholder="Nhập mật khẩu"
                                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-1">Xác nhận mật khẩu</label>
                            <div className='relative'>
                                <input
                                    type={confirmShowPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={data.confirmPassword || ""}
                                    onChange={handleOnchange}
                                    required
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => setConfirmShowPassword((prev) => !prev)}
                                >
                                    {confirmShowPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300"
                        >
                            Đăng ký
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Đã có tài khoản?{" "}
                        <a href="/login" className="text-blue-500 hover:underline">Đăng nhập ngay</a>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Page;
