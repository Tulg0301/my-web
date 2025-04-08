'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:8080/api/search", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query })
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
  }, [query])

  return (
    <div className="container mx-auto px-10 py-6">
      <h2 className="text-2xl font-semibold mb-4">Kết quả tìm kiếm: {data.length}</h2>

      {loading && <p className="text-center text-lg">Đang tải...</p>}

      {!loading && data.length === 0 && (
        <p className="text-center text-lg bg-white p-4 rounded">Không tìm thấy sản phẩm nào.</p>
      )}

      {!loading && data.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((product, index) => (
            <Link href={`product-detail/${product._id}`} key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
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
  )
}

export default Page
