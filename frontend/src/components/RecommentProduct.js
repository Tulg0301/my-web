"use client"
import React, { useEffect, useState } from "react";
import fetchCategoryWProduct from "../helpers/fetchCategoryWiseProduct"
import displayVNDCurrency from '@/helpers/displayCurrency';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Link from "next/link";
import addToCart from '@/helpers/addToCart'

const ProductCard = ({ product }) => {
  return (
    <Link href={`/product-detail/${product._id}`} className="border relative rounded-lg p-4 shadow-lg bg-white flex flex-col items-center h-full">
      <div className="w-full max-w-xs h-40 flex items-center justify-center overflow-hidden">
        <img src={product.productImage[0]} alt={product.productName} className="max-w-full max-h-full object-contain rounded-lg" />
        {product.price !== product.sellingPrice && (
          <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-r-lg font-semibold">
            Giảm {((100 - (product.sellingPrice / product.price) * 100).toFixed(0))}%
          </span>
        )}
      </div>
      <h3 className="text-sm md:text-lg font-semibold mt-2 text-center flex-grow text-ellipsis line-clamp-2 capitalize">{product.productName}</h3>
      <div className="flex items-center justify-between my-2 w-full">
        <span className="text-red-500 font-bold text-xs sm:text-xs md:text-base">{displayVNDCurrency(product.sellingPrice)}</span>
        <span className="text-gray-500 line-through font-semibold text-xs sm:text-xs md:text-sm">{displayVNDCurrency(product.price)}</span>
      </div>
      <div className="mt-auto w-full">
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" onClick={(e)=>addToCart(e,product?._id)}>
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="border rounded-lg p-4 shadow-lg bg-gray-200 animate-pulse h-full flex flex-col items-center">
    <div className="w-full max-w-xs h-40 bg-gray-300 rounded-lg"></div>
    <div className="w-3/4 h-4 bg-gray-300 mt-4 rounded"></div>
    <div className="w-1/2 h-4 bg-gray-300 mt-2 rounded"></div>
    <div className="w-full h-10 bg-gray-300 mt-auto rounded"></div>
  </div>
);

const RecommentProduct = ({ category,heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const category_Product = await fetchCategoryWProduct(category);
      setData(category_Product?.data);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  return (
    <div className="container mx-auto py-4 md:px-8">
      <h2 className="text-2xl font-bold mb-4">{category} {heading}</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {data.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}

          {/* Nút điều hướng tùy chỉnh */}
          <div className="swiper-button-prev custom-swiper-btn">
            <FaChevronLeft className="w-10 h-10 bg-gray-800 text-white p-2 rounded-r-full opacity-50 hover:opacity-100 transition " />
          </div>
          <div className="swiper-button-next custom-swiper-btn ">
            <FaChevronRight className="w-10 h-10 bg-gray-800 text-white p-2 rounded-l-full opacity-50 hover:opacity-100 transition" />
          </div>
        </Swiper>
      )}
    </div>
  );
};

export default RecommentProduct;
