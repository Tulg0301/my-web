"use client";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMiniUserCircle } from "react-icons/hi2";

const AdminLayout = ({ children }) => {
  const user = useSelector((state) => state?.user?.user);
  const userName = useMemo(() => user?.name ?? "", [user]);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="min-h-[calc(100vh-120px)] md:flex hidden">
      {/* Sidebar */}
      <aside className="bg-white min-h-full w-full max-w-60 shadow-lg">
        {/* Avatar & Info */}
        <div className="h-36 bg-blue-500 flex flex-col items-center justify-center">
          <div className="text-5xl relative flex justify-center">
            {userName ? (
              <img
                src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Hinh-dai-dien-hai-huoc-cam-dep-duoi-ai-do.jpg"
                alt={userName}
                className="h-20 w-20 rounded-full border-4 border-white"
              />
            ) : (
              <HiMiniUserCircle />
            )}
          </div>
          <p className="capitalize text-lg font-semibold text-white">{userName}</p>
          <p className="text-sm text-gray-200">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 bg-white shadow-sm rounded-lg w-60">
          <ul className="flex flex-col space-y-2">
            {/* All Users */}
            <li>
              <Link
                href="/adminpanel/all-user"
                className={`block px-4 py-2 font-medium rounded-lg transition ${
                  pathname === "/adminpanel/all-user"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                All Users
              </Link>
            </li>

            {/* All Products */}
            <li>
              <Link
                href="/adminpanel/all-product"
                className={`block px-4 py-2 font-medium rounded-lg transition ${
                  pathname === "/adminpanel/all-product"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                All Products
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full h-screen p-4 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
