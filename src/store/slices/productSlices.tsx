"use client"

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductListResponse, ProductDetailResponse } from "@/types";

const BASE_URL = "http://localhost:3000/Products";

interface ProductState {
  Products: Product[];
  deletedProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  Products: [],
  deletedProducts: [],
  loading: false,
  error: null,
};

// ✅ Fetch all Products
export const fetchProducts = createAsyncThunk(
  "Products/fetch",
  async (_: any, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      const response = await axios.get<ProductListResponse>(`${BASE_URL}`);
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error("Fetch Products error:", err.response?.data || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch Products");
    }
  }
);

export const fetchDeletedProducts = createAsyncThunk(
  "Products/fetchDeleted",
  async (_: any, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      const response = await axios.get<ProductListResponse>(`${BASE_URL}/deleted`);
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error("Fetch deleted Products error:", err.response?.data || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch deleted Products");
    }
  }
);


export const addProduct = createAsyncThunk(
  "Products/add",
  async (data: Omit<Product, "id">, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      console.log("Adding Product:", data);
      const response = await axios.post<ProductDetailResponse>(`${BASE_URL}`, {
        ...data,
        status: "TERMINATED",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      });
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error("Add Product error:", err.response?.data || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add Product");
    }
  }
);

// ✅ Update Product
export const updateProduct = createAsyncThunk(
  "Products/update", // Redux action type
  async ({ id, data }: { id: string; data: Partial<Product> }, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      console.log("Updating Product:", id, data);
      const response = await axios.put<ProductDetailResponse>(`${BASE_URL}/${id}`, {
        ...data,
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
      });
      return response.data.data;
    } catch (error) {
      const err = error as any;
      console.error("Update Product error:", err.response?.data || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update Product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "Products/delete",
  async (id: string, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
        const err = error as any;
        console.error("Update Product error:", err.response?.data || err);
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update Product");
      }
  }
);

export const restoreProduct = createAsyncThunk(
  "Products/restore",
  async (id: string, thunkAPI: { rejectWithValue: (arg0: any) => any; }) => {
    try {
      const response = await axios.post<ProductDetailResponse>(`${BASE_URL}/restore/${id}`);
      return response.data.data;
    } catch (error) {
        const err = error as any;
        console.error("Update Product error:", err.response?.data || err);
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update Product");
      }
  }
);

const ProductSlice = createSlice({
  name: "Products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.Products = action.payload;
    })
    .addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(fetchDeletedProducts.fulfilled, (state, action) => {
      state.deletedProducts = action.payload;
    })
    .addCase(addProduct.fulfilled, (state, action) => {
      state.Products.push(action.payload);
    })
    .addCase(addProduct.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(updateProduct.fulfilled, (state, action) => {
      state.Products = state.Products.map((emp) =>
        emp.id === action.payload.id ? action.payload : emp
      );
    })
    .addCase(updateProduct.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(deleteProduct.fulfilled, (state, action) => {
      const deletedProduct = state.Products.find((emp) => emp.id === action.payload);
      if (deletedProduct) {
        state.deletedProducts.push(deletedProduct);
      }
      state.Products = state.Products.filter((emp) => emp.id !== action.payload);
    })
    .addCase(deleteProduct.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(restoreProduct.fulfilled, (state, action) => {
      state.deletedProducts = state.deletedProducts.filter((emp) => emp.id !== action.payload.id);
      state.Products.push(action.payload);
    })
    .addCase(restoreProduct.rejected, (state, action) => {
      state.error = action.payload as string;
    });
},
});

export default ProductSlice.reducer;