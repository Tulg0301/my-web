"use client"
import React, { useMemo, useState } from 'react'
import { MdDevices } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { HiMiniUserCircle } from "react-icons/hi2";
import { FaCartShopping } from "react-icons/fa6"; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import ROLE from '@/common/role'
import { toast } from 'react-toastify';
import { setUserDetail } from '@/store/userSlice';

const Header = () => {
    const user = useSelector(state => state?.user?.user)
    const cartProductCount = useSelector((state) => state.user.cartProductCount);
    const userName = useMemo(() => user?.name ?? '', [user]);
    const [inputSearch, setInputSearch] = useState('')
    const dispatch = useDispatch()
    const router = useRouter()
    const [menuDisplay, setMenuDisplay] = useState(false)

    const handleLogout = async () => {
        const fetchData = await fetch("http://localhost:8080/api/userLogout", {
            method: "GET",
            credentials: "include"
        })
        const dataApi = await fetchData.json()

        if (dataApi.success) {
            toast.success(dataApi.message, {
                autoClose: 500,
            });
            dispatch(setUserDetail(null))
            router.push('/')
        }
        if (dataApi.error) {
            toast.error(dataApi.message)
        }
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setInputSearch(value)
    }

    const handleSearchClick = () => {
        if (inputSearch.trim()) {
            router.push(`/search-product?q=${inputSearch.trim()}`);
        } else {
            router.push(`/search-product`);
        }
    }

    return (
        <header className='h-16 shadow-md px-4 bg-white fixed w-full z-40 md:px-14'>
            <div className='h-full container mx-auto flex items-center px-6 justify-between'> 
                <div className='haha py-4 pr-6 md:pr-10 pl-6' onClick={() => setInputSearch('')}>
                    <Link href={"/"}>
                        <span className='text-lg font-bold'><MdDevices size={40} /></span>
                    </Link>
                </div>

                {/* Ô tìm kiếm */}
                <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
                    <input 
                        type="text" 
                        placeholder="Nhập từ khóa tìm kiếm..." 
                        value={inputSearch}
                        className='w-full outline-none'
                        onChange={handleSearch}
                    />
                    <div
                        onClick={handleSearchClick}
                        className='text-lg min-w-[50px] text-white h-8 bg-blue-500 hover:bg-blue-600 flex items-center justify-center rounded-r-full cursor-pointer'
                    >
                        <IoSearchOutline />
                    </div>
                </div>

                {/* Phần user/cart/logout */}
                <div className='flex items-center gap-5'>
                    <div className='relative flex justify-center'>
                        <div
                            className="text-3xl cursor-pointer relative flex justify-center"
                            onClick={() => setMenuDisplay(prev => !prev)}
                        >
                            {userName ? (
                                <img
                                    src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Hinh-dai-dien-hai-huoc-cam-dep-duoi-ai-do.jpg"
                                    alt={userName}
                                    className="h-10 w-10 rounded-full"
                                />
                            ) : (
                                <HiMiniUserCircle />
                            )}
                        </div>

                        {menuDisplay && userName && (
                            <div className='absolute bg-blue-500 hover:bg-blue-600 top-11 h-fit px-2 py-2 shadow-lg rounded z-50'>
                                <nav>
                                    {user?.role === ROLE.ADMIN ? (
                                        <Link href={"/adminpanel"} className='whitespace-nowrap block text-base text-white px-2'>
                                            Trang quản trị
                                        </Link>
                                    ) : (
                                        <Link href={"/order"} className='whitespace-nowrap block text-base text-white px-2'>
                                            Đơn hàng
                                        </Link>
                                    )
                                    
                                    }
                                </nav>
                            </div>
                        )}
                    </div>

                    <Link href={'/cart'} className='text-2xl relative'>
                        <span><FaCartShopping /></span>
                        {user?._id && (
                            <div className='bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-3 -right-3'>
                                <p className='text-sm'>{cartProductCount}</p>
                            </div>
                        )}
                    </Link>

                    <div>
                        {user?._id ? (
                            <button
                                onClick={handleLogout}
                                className='px-3 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white'
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <Link
                                href={"/login"}
                                className='px-3 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white'
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
