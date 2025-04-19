
"use client";

import displayVNDCurrency from "@/helpers/displayCurrency";
import { setCartProductCount } from "@/store/userSlice";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const cartProductCount = useSelector((state) => state.user.cartProductCount)
    const loadingCart = new Array(cartProductCount).fill(null)
    const [showFormDelivery, setShowFormDelivery] = useState(false);
    const [dataOrder,setDataOrder]=useState({
        paymentMethod: "",
        receiverName: "",
        receiverPhone: "",
        shippingAddress: "",
        items: []
    })
    const fetchOrder = async (datafinal) => {
      try {
  
        const res = await fetch("http://localhost:8080/api/create-order", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(datafinal)
        })

        const json = await res.json()
        if(json.success){
          toast.success("Đặt hàng thành công")
        }

      } catch (err) {
        console.error("Fetch error: ", err)
 
      }
    }
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/view-cart-product", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const resApi = await response.json();
            if (resApi.success) {
                setData(resApi.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await fetch("http://localhost:8080/api/update-cart-product", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                quantity: qty + 1,
            }),
        });
    
        const resApi = await response.json();
        if (resApi.success) {
            setData(prevData => prevData.map(item => 
                item._id === id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        }
    };
    
    const decreaseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch("http://localhost:8080/api/update-cart-product", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    quantity: qty - 1,
                }),
            });
    
            const resApi = await response.json();
            if (resApi.success) {
               
                setData(prevData => prevData.map(item => 
                    item._id === id ? { ...item, quantity: item.quantity - 1 } : item
                ));
            }
        }
    };
    const delCartProduct = async (id) => {
        try {
            const response = await fetch("http://localhost:8080/api/delete-cart-product", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
    
            const resApi = await response.json();
    
            if (resApi.success) {
                setData(prevData => prevData.filter(item => item._id !== id));
                fetchUserAddToCart()
            } else {
                console.error("Xóa thất bại:", resApi.message);
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };
    const  dispatch  = useDispatch()

    const fetchUserAddToCart = async ()=>{
            const dataResponse = await fetch("http://localhost:8080/api/countaddtocart", {
              method: "GET",
              credentials: "include",
            });
            const dataApi = await dataResponse.json();
            dispatch(setCartProductCount(dataApi?.data?.count || 0));
          }
    
    const totalQty =data.reduce((prev,current)=>prev+current.quantity,0)
    const totalPrice = data.reduce((prev,current)=>prev + (current?.productId?.sellingPrice*current.quantity),0)
    const handleOrder = async (e) =>{
      e.preventDefault();
      const datafinal = {...dataOrder,items:data}
      console.log(datafinal)
      fetchOrder(datafinal)
    }

    return (
        <div className="container mx-auto p-4">
          <div className="text-center text-lg my-3">
            {data.length === 0 && !loading && <p>Không có sản phẩm nào trong giỏ hàng.</p>}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 lg:justify-center">
            {/* Danh sách sản phẩm */}
            <div className="w-full lg:max-w-3xl lg:h-[100vh] lg:overflow-y-auto">
              {loading ? (
                loadingCart.map((_, index) => (
                  <div
                    key={index}
                    className="w-full bg-slate-200 h-32 mb-3 rounded-xl animate-pulse shadow"
                  ></div>
                ))
              ) : (
                data.map((product) => (
                  <div
                    key={product._id}
                    className="w-full bg-white h-36 mb-4 rounded-xl shadow grid grid-cols-[100px,1fr] "
                  >
                    <div className="bg-gray-100 flex justify-center items-center">
                      <img
                        src={product?.productId?.productImage[0]}
                        className="w-24 h-24 object-contain"
                        alt={product?.productId?.productName}
                      />
                    </div>

                    <div className="relative p-4">
                      {/* Nút xoá */}
                      <button
                        className="absolute top-2 right-2 text-red-600 hover:text-white hover:bg-red-500 rounded-full p-1 transition"
                        onClick={() => delCartProduct(product._id)}
                      >
                        <MdDelete size={20} />
                      </button>

                      <h2 className="text-lg font-semibold line-clamp-1 capitalize pr-4">
                        {product?.productId?.productName}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {product?.productId?.category}
                      </p>
                      <p className="text-red-500 font-bold text-base mt-1">
                        {displayVNDCurrency(product?.productId?.sellingPrice)}
                      </p>

                      {/* Quantity control */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                          onClick={() => decreaseQty(product._id, product.quantity)}
                        >
                          −
                        </button>
                        <span className="min-w-[24px] text-center">{product.quantity}</span>
                        <button
                          className="w-7 h-7 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                          onClick={() => increaseQty(product._id, product.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Tổng tiền */}
            {
              data.length > 0 && (
                <div className="w-full lg:max-w-xl h-fit bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Tóm tắt đơn hàng</h2>
  
                <div className="flex justify-between items-center text-gray-700 mb-3">
                  <span>Số lượng sản phẩm:</span>
                  <span className="font-medium">{totalQty}</span>
                </div>
  
                <div className="flex justify-between items-center text-gray-700">
                  <span>Tổng thanh toán:</span>
                  <span className="text-red-500 font-bold text-lg">
                    {displayVNDCurrency(totalPrice)}
                  </span>
                </div>
  
                <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition"
                        onClick={()=>setShowFormDelivery(true)}
                >
                  Đặt hàng
                </button>
              </div>
              )
            }

          </div>

          {
            showFormDelivery && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Thông tin vận chuyển</h2>
                      <button
                        className="text-gray-500 hover:text-white hover:bg-red-500 rounded-full h-8 w-8"
                        onClick={()=>setShowFormDelivery(false)}
                      >
                        X
                      </button>
                    </div>
                    <form className="space-y-4" onSubmit={handleOrder}>
                      {/* Tên người nhận */}
                      <div>
                        <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                          Tên người nhận
                        </label>
                        <input
                          type="text"
                          id="receiverName"
                          value={dataOrder.receiverName}
                          onChange={(e) => setDataOrder({ ...dataOrder, receiverName: e.target.value })}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập tên người nhận"
                        />
                      </div>
            
                      {/* Số điện thoại */}
                      <div>
                        <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="receiverPhone"
                          value={dataOrder.receiverPhone}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Chỉ chấp nhận chuỗi toàn số
                              setDataOrder({ ...dataOrder, receiverPhone: value });
                            }
                          }}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
            
                      {/* Địa chỉ */}
                      <div>
                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                          Địa chỉ
                        </label>
                        <textarea
                          id="shippingAddress"
                          value={dataOrder.shippingAddress}
                          onChange={(e) => setDataOrder({ ...dataOrder, shippingAddress: e.target.value })}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập địa chỉ"
                        ></textarea>
                      </div>
            
                      {/* Phương thức thanh toán */}
                      <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                          Phương thức thanh toán
                        </label>
                        <select
                          id="paymentMethod"
                          value={dataOrder.paymentMethod}
                          onChange={(e) => setDataOrder({ ...dataOrder, paymentMethod: e.target.value })}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="creditCard">Thẻ tín dụng</option>
                          <option value="paypal">PayPal</option>
                          <option value="cashOnDelivery">Thanh toán khi nhận hàng</option>
                        </select>
                      </div>
            
                      {/* Nút đặt hàng */}
                      <div className="mt-4 flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
     
                        >
                          Đặt hàng
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
            )
          }
</div>

    );
};

export default Page;

