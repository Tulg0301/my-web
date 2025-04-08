"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import productCategory from "@/helpers/producCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "@/helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import SummaryApi from "@/common";
import { toast } from "react-toastify";

const AdminEditProduct = ({
        onClose,
        productData,
        refreshProducts 
    }) => {
    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        brandName: productData?.brandName,
        category: productData?.category,
        productImage: productData?.productImage || [],
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice,
      });
    
      const [openFullScreenImg, setOpenFullScreenImage] = useState(false);
      const [fullScreenImage, setFullScreenImage] = useState("");
    
      const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const uploadImageCloudinary = await uploadImage(file);
          setData((prev) => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageCloudinary.url],
          }));
        } catch (error) {
          console.error("Lỗi khi tải ảnh lên:", error);
        }
      };
    
      const handleDelete = (index) => {
        setData((prev) => {
          const newDataImg = [...prev.productImage];
          newDataImg.splice(index, 1);
          return {
            ...prev,
            productImage: newDataImg,
          };
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:8080/api/update-product", {
                method: SummaryApi.uploadProduct.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                console.error("Lỗi từ server:", response.status, await response.text());
                return toast.error("Lỗi khi gửi dữ liệu lên server!");
            }
    
            const resApi = await response.json();
    
            if (resApi.success) {
                toast.success(resApi.message, { autoClose: 500 });
                refreshProducts();
                onClose();
            } else {
                toast.error(resApi.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            toast.error("Lỗi không xác định, vui lòng thử lại!");
        }
    };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center backdrop-blur-none bg-black/30">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Sửa sản phẩm</h2>
          <button
            className="ml-auto block text-gray-600 hover:text-white hover:bg-red-500 p-2 rounded-full"
            onClick={onClose}
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <form className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
              onSubmit={handleSubmit}
        >
          <label htmlFor="productName">Tên sản phẩm:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            placeholder="Nhập tên sản phẩm"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-2">Tên hãng:</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            placeholder="Nhập tên hãng"
            value={data.brandName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-2">Loại sản phẩm:</label>
          <select
            id="category"
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value={""}>Chọn loại sản phẩm</option>
            {productCategory.map((el, index) => (
              <option value={el.value} key={el.value + index}>
                {el.label}
              </option>
            ))}
          </select>

          <label htmlFor="productImage" className="mt-2">Ảnh sản phẩm:</label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p>Upload image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>

          <div>
            {data.productImage.length > 0 ? (
              <div className="flex items-center gap-2">
                {data.productImage.map((el, index) => (
                  <div key={index} className="relative h-28 w-28">
                    <img
                      src={el}
                      alt={`Ảnh ${index}`}
                      
                      className="bg-slate-100 border cursor-pointer h-full w-full object-contain"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <div
                      className="absolute top-0 right-0 p-1 bg-white rounded-full hover:text-white hover:bg-red-500 cursor-pointer"
                      onClick={() => handleDelete(index)}
                    >
                      <MdDeleteForever />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-600 text-xs">*Bạn chưa thêm ảnh</p>
            )}
          </div>

          <label htmlFor="price">Giá :</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Nhập giá sản phẩm"
            value={data.price}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="sellingPrice">Giá bán :</label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            placeholder="Nhập giá bán sản phẩm"
            value={data.sellingPrice}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description">Mô tả sản phẩm :</label>
          <textarea className="h-28 bg-slate-100 border rounded resize-none p-1"
                    placeholder="Nhập mô tả sản phẩm"
                    rows={3}
                    name="description"
                    value={data.description}
                    onChange={handleOnChange}
                    required
          />

          <button className="px-3 py-2 bg-[#97d2f4f0] hover:bg-[#6bb9e3] mb-5">
            Lưu thay đổi
          </button>
        </form>
      </div>

      {openFullScreenImg && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  )
}

export default AdminEditProduct
