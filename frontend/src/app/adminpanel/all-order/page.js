"use client"
import React, { useEffect, useState } from 'react'
import moment from "moment"

const statusMap = {
  "Đang xử lý": "Đang xử lý",
  "Đang chuẩn bị hàng": "Đang chuẩn bị hàng",
  "Đã gửi cho bên vận chuyển": "Đã gửi cho bên vận chuyển",
  "Đang vận chuyển": "Đang vận chuyển",
  "Đã giao hàng": "Đã giao hàng",
  "Đã hủy": "Đã hủy"
};
const statusColorMap = {
    "Đang xử lý": "bg-yellow-100 text-yellow-800",
    "Đang chuẩn bị hàng": "bg-blue-100 text-blue-800",
    "Đã gửi cho bên vận chuyển": "bg-indigo-100 text-indigo-800",
    "Đang vận chuyển": "bg-purple-100 text-purple-800",
    "Đã giao hàng": "bg-green-100 text-green-800",
    "Đã hủy": "bg-red-100 text-red-800",
  };
  

const Page = () => {
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchData = async () => {
    try {
      const resApi = await fetch("http://localhost:8080/api/get-all-order", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const dataResponse = await resApi.json();
      console.log('Dữ liệu trả về:', dataResponse); 
      
      // Kiểm tra xem dataResponse có dữ liệu đúng hay không
      if (Array.isArray(dataResponse?.data)) {
        setData(dataResponse.data);  // Cập nhật dữ liệu nếu là mảng
      } else {
        setData([]);  // Nếu không phải mảng, gán giá trị mặc định là mảng rỗng
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setData([]);  // Cập nhật mảng rỗng nếu gặp lỗi
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
        setFormStatus(null);  // Đóng modal
        setNewStatus("");  // Reset lại trạng thái mới
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  useEffect(() => {
    fetchData();  // Lấy dữ liệu khi component được render lần đầu
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 text-left">STT</th>
            <th className="px-4 py-2 text-left">Tên tài khoản</th>
            <th className="px-4 py-2 text-left">email</th>
            <th className="px-4 py-2 text-left">Tổng tiền</th>
            <th className="px-4 py-2 text-left">Ngày đặt</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {/* Kiểm tra dữ liệu trước khi render */}
          {Array.isArray(data) && data.length > 0 ? (
            data.map((order, index) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{order.userName}</td>
                <td className="px-4 py-2">{order.email}</td>
                <td className="px-4 py-2">{order.totalPrice.toLocaleString()} ₫</td>
                <td className="px-4 py-2">{moment(order.createdAt).format('DD-MM-YYYY')}</td>
                <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded-lg text-sm font-medium ${
                        statusColorMap[order.status] || "bg-gray-200 text-gray-800"
                    }`}
                    >
                    {statusMap[order.status] || "Không xác định"}
                </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Xem chi tiết
                  </button>

                  <button
                    onClick={() => {
                      setNewStatus(order.status);
                      setFormStatus(order);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm ml-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">Chưa có đơn hàng nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h3>
            <p><strong>Người nhận:</strong> {selectedOrder.receiverName}</p>
            <p><strong>SĐT:</strong> {selectedOrder.receiverPhone}</p>
            <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Tổng tiền:</strong> {selectedOrder.totalPrice.toLocaleString()} ₫</p>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Danh sách sản phẩm</h4>
              <table className="w-full border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border-b">STT</th>
                    <th className="px-4 py-2 border-b">Tên sản phẩm</th>
                    <th className="px-4 py-2 border-b">Giá</th>
                    <th className="px-4 py-2 border-b">Số lượng</th>
                    <th className="px-4 py-2 border-b">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, i) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{item.productName}</td>
                      <td className="px-4 py-2">{item.price.toLocaleString()} ₫</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal cập nhật trạng thái đơn hàng */}
      {formStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setFormStatus(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Trạng thái mới:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              >
                {Object.keys(statusMap).map((status) => (
                  <option key={status} value={status}>
                    {statusMap[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setFormStatus(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Hủy
              </button>
              <button
                onClick={async() => {
                  if (!newStatus) {
                    alert("Vui lòng chọn trạng thái mới.");
                    return;
                  }
                  await fetchUpdate(formStatus._id, newStatus);
                  await fetchData();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
