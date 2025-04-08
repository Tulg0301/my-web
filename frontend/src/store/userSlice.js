import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: { name: "" } ,
    cartProductCount: 0,

}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetail : (state, action) => {
        state.user = action.payload
    },
    setCartProductCount: (state, action) => { 
      state.cartProductCount = action.payload;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {setUserDetail, setCartProductCount  } = userSlice.actions

export default userSlice.reducer