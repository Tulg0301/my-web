"use client";
import { setUserDetail, setCartProductCount } from "@/store/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UserDetailsFetcher = () => {
  const dispatch = useDispatch()
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user-details", {
        method: "GET",
        credentials: "include",
      });


      const dataApi = await response.json();

      if(dataApi.success){
        dispatch(setUserDetail(dataApi.data))
      }
      
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchUserAddToCart = async ()=>{
    const dataResponse = await fetch("http://localhost:8080/api/countaddtocart", {
      method: "GET",
      credentials: "include",
    });
    const dataApi = await dataResponse.json();
    dispatch(setCartProductCount(dataApi?.data?.count || 0));
  }

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return null; 
};

export default UserDetailsFetcher;
