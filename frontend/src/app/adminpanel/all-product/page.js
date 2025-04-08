"use client"
import SummaryApi from '@/common'
import UpLoadProduct from '@/components/UploadProduct'
import { MdEdit, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import AdminEditProduct from '@/components/AdminEditProduct';
import { toast } from 'react-toastify';
import displayVNDCurrency from '@/helpers/displayCurrency';

const Page = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [allProduct, setAllProduct] = useState([]);

  // Lấy danh sách sản phẩm từ API
  const fetchAllProduct = async () => {
    try {
      const resApi = await fetch(SummaryApi.allProduct.url);
      const dataResponse = await resApi.json();
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  const handleDeleteProduct = async () => {
    if (!selectedDelete) return;
    try {
      const res = await fetch(`http://localhost:8080/api/product/${selectedDelete._id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success(resData.message);
        setShowConfirm(false);
        fetchAllProduct(); 
      } else {
        console.error("Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi kết nối tới API", error);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      {/* Header */}
      <div className='bg-blue-500 text-white p-2 flex justify-between items-center rounded-lg shadow-md'>
        <h2 className='font-bold text-xl'>Tất cả sản phẩm</h2>
        <button 
          className='bg-white text-blue-500 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-300'
          onClick={() => setOpenUploadProduct(true)}
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      {allProduct.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
          {allProduct.map((product, index) => (
            <div 
              key={index} 
              className='bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col items-center'
            >

              <img src={product?.productImage[0]} className='w-64 h-40 object-contain rounded-md' />
              <h1 className='text-lg font-semibold mt-3 text-gray-800 text-center text-ellipsis line-clamp-2'>{product?.productName}</h1>
              <p className='text-lg font-bold text-green-600 mt-2'>{displayVNDCurrency(product?.sellingPrice)}</p>

              {/* Nút thao tác */}
              <div className='flex gap-3 mt-auto pt-3'>
                {/* Nút Xóa */}
                <button 
                  className='flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition duration-300'
                  onClick={() => {
                    setShowConfirm(true);
                    setSelectedDelete(product);
                  }}
                >
                  <MdDelete size={20} />
                </button>

                {/* Nút Chỉnh Sửa */}
                <button 
                  className='flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition duration-300'
                  onClick={() => {
                    setSelectedEditProduct(product);
                    setOpenEditProduct(true);
                  }}
                >
                  <MdEdit size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='p-5 text-center text-gray-600 italic'>Danh sách sản phẩm trống.</div>
      )}

      {/* Popup xác nhận xóa */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
            <p className="mt-4 text-gray-600">Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={handleDeleteProduct}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup chỉnh sửa sản phẩm */}
      {openEditProduct && selectedEditProduct && (
        <AdminEditProduct 
          onClose={() => setOpenEditProduct(false)} 
          productData={selectedEditProduct}
          refreshProducts={fetchAllProduct} 
        />
      )}

      {/* Popup thêm sản phẩm */}
      {openUploadProduct && (
        <UpLoadProduct onClose={() => setOpenUploadProduct(false)} refreshProducts={fetchAllProduct} />
      )}
    </div>
  );
};

export default Page;
