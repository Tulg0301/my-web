"use client";
import React, { useState, useEffect } from 'react';
import { BsBox2Fill } from "react-icons/bs";
import { format } from 'date-fns';
import { FaMoneyBillWave } from "react-icons/fa";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelModal,setShowCancelModal] = useState(false)
  
  const statusColorMap = {
    "Đang xử lý": "bg-yellow-100 text-yellow-800",
    "Đang chuẩn bị hàng": "bg-blue-100 text-blue-800",
    "Đã gửi cho bên vận chuyển": "bg-indigo-100 text-indigo-800",
    "Đang vận chuyển": "bg-purple-100 text-purple-800",
    "Đã giao hàng": "bg-green-100 text-green-800",
    "Đã hủy": "bg-red-100 text-red-800",
  };
  

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/get-order-by-userid", {
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
      console.error("Lỗi khi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchUpdate = async (orderId, newStatus) => {
    try {
      const resApi = await fetch("http://localhost:8080/api/update-status-order", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          newStatus
        })
      });


      const dataResponse = await resApi.json();
      if (dataResponse?.data) {
        setData(dataResponse.data); // Cập nhật lại dữ liệu sau khi thay đổi trạng thái
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleCancelOrder = async () => {
    if (orderToCancel) {
      await fetchUpdate(orderToCancel._id, "Đã hủy");
      await fetchData()
      setShowCancelModal(false)

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayVNDCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto h-[100vh]">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BsBox2Fill /> Đơn hàng của bạn
      </h2>

      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : data.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto">
        <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
            <thead>
            <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 text-left">Mã đơn</th>
                <th className="px-4 py-2 text-left">Ngày đặt</th>
                <th className="px-4 py-2 text-right">Tổng tiền</th>
                <th className="px-4 py-2 text-left">Thanh toán</th>
                <th className="px-4 py-2 text-left">Người nhận</th>
                <th className="px-4 py-2 text-left">Địa chỉ</th>
                <th className="px-4 py-2 text-center">Trạng thái</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {/* Kiểm tra dữ liệu trước khi render */}
            {Array.isArray(data) && data.length > 0 ? (
                data.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</td>
                    <td className="px-4 py-2 text-right">
                    {displayVNDCurrency(order.totalPrice)}
                    </td>
                    <td className="px-4 py-2  text-sm">
                    {order.paymentMethod === "cashOnDelivery" ? "Khi nhận hàng" : "Đã thanh toán"}
                    </td>
                    <td className="px-4 py-2">
                    {order.receiverName} <br />
                    <span className="text-xs text-gray-500">{order.receiverPhone}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{order.shippingAddress}</td>
                    <td className="px-4 py-2 text-center">
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        statusColorMap[order.status]
                        }`}
                    >
                        {order.status}
                    </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                        <div className='flex flex-col md:flex-row gap-2'>
                            <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                        >
                            Xem
                        </button>
                        {
                            order.status === "Đang xử lý" && (
                                <button
                                        className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                        onClick={() => {
                                            setOrderToCancel(order);
                                            setShowCancelModal(true);
                                          }}
                                    >
                                        Hủy
                                </button>
                                    )
                        }
                        </div>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                    Chưa có đơn hàng nào.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>

        </div>

      )}
      
      {/* Modal xác nhận hủy */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <h3 className="text-xl font-bold mb-4">Xác nhận hủy đơn hàng</h3>
            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative overflow-auto max-h-[80vh]">
            <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">STT</th>
                      <th className="p-2 border text-left">Tên sản phẩm</th>
                      <th className="p-2 border">Giá</th>
                      <th className="p-2 border">Số lượng</th>
                      <th className="p-2 border">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border text-left">{item.productName}</td>
                        <td className="p-2 border">{displayVNDCurrency(item.price)}</td>
                        <td className="p-2 border">{item.quantity}</td>
                        <td className="p-2 border">{displayVNDCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Không có chi tiết sản phẩm nào.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
