import { createSlice } from "@reduxjs/toolkit"

const initialState={
    selectedProduct:{checked:[{}]}
}

const ProductSlice=createSlice({name:"selectedProduct",initialState,reducers:{
    setSeletedProduct(state,action){
        state.selectedProduct=action.payload
    }
}})

export const ProductAction=ProductSlice.actions

export default ProductSlice;