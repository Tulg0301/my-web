"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:8080/api/get-product-category", {
                method: "GET"
            })
            const dataRes = await response.json()
            setCategoryProduct(dataRes.data)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])

    return (
        <div className='container mx-auto py-8 px-4 md:p-8'>
            <div className='flex items-center justify-between gap-4 overflow-scroll scrollbar-none'>
                {loading ? (
                    <p>Đang tải danh mục...</p>
                ) : (
                    categoryProduct.map((product, index) => (
                        <Link href={`/category-product/${encodeURIComponent(product.category)}`} key={index} className='cursor-pointer'>
                            <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200'>
                                <img src={product?.productImage[0]} alt={product.category}
                                    className='w-full h-full object-contain mix-blend-multiply hover:scale-125 transition-all'
                                />
                            </div>
                            <p className='text-center mt-1 text-sm md:text-base'>{product?.category}</p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default CategoryList
