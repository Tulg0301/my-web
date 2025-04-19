"use client"
import productCategory from '@/helpers/producCategory'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';

const page = () => {
  const [sortOrder, setSortOrder] = useState("");
  const params= useParams()
  const query = decodeURIComponent(params.categoryName)
  const [data,setData] =useState([])
  const [loading,setLoading] = useState(false)
  const [selectCategory,setSelectCategory] = useState({})
  useEffect(() => {
    const arrCategory = Object.keys(selectCategory).map((ctgKeyName)=>{
      if(selectCategory[ctgKeyName]){
        return ctgKeyName
      }
      return null
    }).filter(el=>el)
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const res = await fetch("http://localhost:8080/api/search", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query, arrCategory:arrCategory, sortOrder:sortOrder})
          })
  
          const json = await res.json()
          setLoading(false)
          setData(json.data)
        } catch (err) {
          console.error("Fetch error: ", err)
          setLoading(false)
        }
      }
      
  
      if (query) {
        fetchProduct()
      }
    }, [query,selectCategory,sortOrder])
    useEffect(() => {
      if (query) {
        setSelectCategory({ [query]: true });
      }
    }, [query]);

    const handelSelectCategory = (e)=>{
      const {name,value,checked} = e.target

      setSelectCategory((preve)=>{
        return {
          ...preve,
          [value] : checked
        }
      })
    }
    

  return (
    <div className='container mx-auto p-4'>
        {/* {des ver} */}
        <div className='hidden lg:grid grid-cols-[200px,1fr]'>
          {/* {left side} */}
          <div className='bg-white p-2 min-h-[calc(100vh-120px)]'>
            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 text-center border-slate-300'>Sắp xếp theo</h3>

              <form className='text-sm flex flex-col gap-2 py-2'>
                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' id='lowhight' value='asc' checked={sortOrder==='asc'}
                         onChange={(e) => setSortOrder(e.target.value)}/>
                  <label htmlFor='lowhight'>Giá Thấp - Cao</label>
                </div>

                <div className='flex items-center gap-3'>
                  <input type='radio' name='sortBy' id='hightlow' value='desc' checked={sortOrder==='desc'}
                         onChange={(e) => setSortOrder(e.target.value)}/>
                  <label htmlFor='hightlow'>Giá Cao - Thấp</label>
                </div>
              </form>
            </div>

            <div>
              <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-2 text-center border-slate-300'>Loại sản phẩm</h3>

              <form className='text-sm flex flex-col gap-2 py-2'>
                {productCategory.map((categoryName,index)=>{
                  return (
                    <div key={index} className='flex items-center gap-3 text-sm'>
                      <input type='checkbox' name={"category"} value={categoryName.value} checked={!!selectCategory[categoryName.value]} id={categoryName.value} onChange={(e)=>handelSelectCategory(e)}/>
                      <label htmlFor={categoryName.value}>{categoryName.label}</label>
                    </div>
                  )
                })}
              </form>
            </div>
          </div>

          
          {/* {right side} */}
          <div className="container mx-auto px-10 ">
      {loading && <p className="text-center text-lg">Đang tải...</p>}

      {!loading && data.length === 0 && (
        <p className="text-center text-lg bg-white p-4 rounded">Không tìm thấy sản phẩm nào.</p>
      )}

      {!loading && data.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((product, index) => (
            <Link href={`/product-detail/${product._id}`} key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
              <img
                src={product.productImage?.[0] || 'https://via.placeholder.com/150'}
                alt={product.productName}
                className="w-full h-48 object-contain rounded"
              />
              <div className="mt-3">
                <h3 className="text-lg font-bold line-clamp-1 capitalize">{product.productName}</h3>
                <p className="text-sm text-gray-500">{product.brandName} - {product.category}</p>
               

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-red-600 font-bold text-base">
                    {product.sellingPrice?.toLocaleString()}đ
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.price?.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
        </div>
    </div>
  )
}

export default page
