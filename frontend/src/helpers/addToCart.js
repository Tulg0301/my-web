
import { setCartProductCount } from "@/store/userSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

const addToCart = async (e,id,dispatch)=>{
    e?.stopPropagation()
    e?.preventDefault()


    const response = await fetch("http://localhost:8080/api/addtocart",{
        method : "POST",
        credentials : "include",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            productId: id
        })
    })
    const fetchUserAddToCart = async (dispatch)=>{
        const dataResponse = await fetch("http://localhost:8080/api/countaddtocart", {
          method: "GET",
          credentials: "include",
        });
        const dataApi = await dataResponse.json();
        dispatch(setCartProductCount(dataApi?.data?.count || 0));
      }

    const resData = await response.json()
     if (resData.success){
         toast.success(resData.message)
         fetchUserAddToCart(dispatch)
     }
     if (resData.error){
        toast.error(resData.message)
    }
}
export default addToCart;