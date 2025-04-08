"use client"

import displayVNDCurrency from '@/helpers/displayCurrency';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import RecommentProduct from '@/components/RecommentProduct'
import addToCart from '@/helpers/addToCart';
import { useDispatch } from 'react-redux';

const page = () => {

    const [data,setData]=useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: ""
    })
    const [loading,setLoading]=useState(false)
    const productImageList = new Array(4).fill(null)

    const dispatch=useDispatch()

    const [activeImage,setActiveImage] = useState(null)
    const params = useParams()
    
    const fetchGetProductDetail = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/product-details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: params?.productId,
                }),
            });
    
            const resApi = await response.json();
            setData(resApi.data);
            setActiveImage(resApi.data.productImage[0]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchGetProductDetail();
    },[])
    const handleMouseEnterProduct = (imageURL)=>{
        setActiveImage(imageURL)
    }
  return (
    <div className='container mx-auto py-4 px-4 md:px-14'>
        <div className=' min-h-[200px] flex flex-col lg:flex-row gap-8 md:px-8'>
            {/** anh san pham */}
            <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
                <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 shadow'>
                    <img src={activeImage} className='h-[300px] w-[300px] lg:h-96 lg:w-96 object-scale-down mix-blend-multiply '/>
                </div>
                <div className='h-full'>
                    {
                        loading ? (
                           <div className=' flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                            {
                                productImageList.map((el,index)=>(
                                    <div className='h-20 w-20 bg-slate-200 rounded animate-pulse shadow' key={index}>
                                        
                                    </div>

                                ))
                            }
                           </div>
                        ): (
                            <div className=' flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                            {
                                data.productImage.map((imageURL,index)=>(
                                    <div className='h-20 w-20 bg-slate-200 rounded p-1' key={index}>
                                        <img src = {imageURL} className=' w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imageURL)}/>
                                    </div>

                                ))
                            }
                           </div>
                        )
                    } 
                </div>
            </div>

            {/** info san pham */}

           
            <div className="flex flex-col gap-2 w-full">
    {/* Hiển thị skeleton loading nếu đang tải */}
    {loading ? (
        <div className=" h-6 bg-gray-300 animate-pulse rounded w-full"></div>
    ) : (
        <p className="bg-red-200 text-red-600 px-2 rounded-full w-fit">{data?.brandName}</p>
    )}

    {loading ? (
        <div className="w-full h-8 bg-gray-300 animate-pulse rounded"></div>
    ) : (
        <h2 className="text-2xl lg:text-4xl font-medium capitalize">{data?.productName}</h2>
    )}

    {loading ? (
        <div className="w-24 h-6 bg-gray-300 animate-pulse rounded"></div>
    ) : (
        <p className="capitalize text-slate-400">{data?.category}</p>
    )}

    <div className="flex gap-1 items-center text-red-600">
        {loading ? (
            <div className="flex gap-1">
                {Array(5).fill(null).map((_, index) => (
                    <div key={index} className="w-6 h-6 bg-gray-300 animate-pulse rounded"></div>
                ))}
            </div>
        ) : (
            <>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
            </>
        )}
    </div>

    <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1">
        {loading ? (
            <>
                <div className="w-20 h-8 bg-gray-300 animate-pulse rounded"></div>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded"></div>
            </>
        ) : (
            <>
                <p className="text-red-600">{displayVNDCurrency(data.sellingPrice)}</p>
                <p className="text-slate-400 line-through">{displayVNDCurrency(data.price)}</p>
            </>
        )}
    </div>

    <div className="flex item-center gap-3">
        {loading ? (
            <>
                <div className="w-[120px] h-10 bg-gray-300 animate-pulse rounded"></div>
                <div className="w-[120px] h-10 bg-gray-300 animate-pulse rounded"></div>
            </>
        ) : (
            <>
                <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition min-w-[120px]">
                    Mua ngay
                </button>
                <button className="border-2 border-blue-600 rounded px-3 py-1 min-w-[120px] hover:bg-blue-600 hover:text-white"
                        onClick={(e)=>addToCart(e,data?._id,dispatch)}
                >
                    Thêm vào giỏ hàng
                </button>
            </>
        )}
    </div>

    <div>
        {loading ? (
            <div className="w-full h-8 bg-gray-300 animate-pulse rounded"></div>
        ) : (
            <>
                <p className="text-slate-600 font-medium my-1">Thông tin sản phẩm :</p>
                <p className='text-justify'>{data.description}</p>
            </>
        )}
    </div>
</div>


        </div>

        {
            data?.category && (
                <RecommentProduct category={data.category} heading="- Sản phẩm tương tự"/>
            )
        }
    </div>
  )
}

export default page
